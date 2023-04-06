<?php
namespace App\Http\Controllers;

use App\Mail\SendTenantEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Models\Role;
use Mockery\Exception;
use App\Models\Property;
use Validator;
use DB;
use Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Http\Response;

class AuthController extends Controller
    {

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
        {
        $this->middleware('auth:api', ['except' => ['registertenant', 'login', 'register']]);
        }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
        {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
            }
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
            }
        return $this->createNewToken($token);
        }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
        {
        $validator = Validator::make($request->all(), [
            'register_as' => 'required|in:Tenant,Owner',
            'first_name' => 'required|string|between:2,100',
            'last_name' => 'required|string|between:2,100',
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|unique:users',
            'nin_number' => 'required|string|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
            'password_confirmation' => 'required|same:password'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
            }
        $user = [];
        try {
            DB::beginTransaction();
            $user = User::create(
                array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                )
            );
            if (strtolower($request->post('register_as')) == 'admin') {
                $admin_role = Role::where('slug', 'admin')->first();
                $user->roles()->attach($admin_role);
                } else if (strtolower($request->post('register_as')) == 'owner') {
                $owner_role = Role::where('slug', 'owner')->first();
                $user->roles()->attach($owner_role);
                } else if (strtolower($request->post('register_as')) == 'tenant') {
                $tenant_role = Role::where('slug', 'tenant')->first();
                $user->roles()->attach($tenant_role);
                }
            DB::commit();
            return response()->json([
                'message' => 'Account has been created successfully',
                'user' => $user
            ], 201);


            }
        catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Account has been created successfully',
                'user' => $user
            ], 400);

            }

        }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
        {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
        }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
        {
        return $this->createNewToken(auth()->refresh());
        }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile()
        {
        return response()->json(auth()->user());
        }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userDetails(Request $request)
        {
        $loggeduser = auth()->user();
        try {
            $thisuser = User::where("id", $request->user)->first();

            if ($loggeduser->hasRole("admin")) {

                } else if ($loggeduser->hasRole("owner")) {
                $thisuser->makeHidden(['created_at', 'updated_at', 'nin_number', 'phone_number', 'email_verified_at']);
                }

            $getuser = $thisuser;
            return response()->json(['user' => $getuser, 'user_properties' => $getuser->properties()->get()], 200);
            }
        catch (Exception $e) {
            return response()->json(
                [
                    'user' => null,
                    'error' => $e->getMessage()
                ]
            );
            }

        }
    protected function createNewToken($token)
        {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user(),
            'roles' => auth()->user()->roles()->get(["id", "name"]),
            'permissions' => auth()->user()->permissions()->get(["id", "name"])
        ]);
        }

    public function inviteTenant(Request $request)
        {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'invite_completion_registration_url' => 'required|url',
            'invite_completion_login_url' => 'required|url',
            'owner' => 'required',
            'property' => 'required',
            'unit' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
            }
        // If email does not exist

        // If email exists
        $this->sendTenantInviteMail($request->all());
        return response()->json([
            'message' => 'Check your inbox, we have sent a link to reset email.'
        ], Response::HTTP_OK);


        }
    public function sendTenantInviteMail($request)
        {
        $token = $this->generateInviteToken($request);
        $property = Property::where("id", $request['property'])->first();
        Mail::to($request['email'])->send(new SendTenantEmail($token, $request['invite_completion_registration_url'], $request['invite_completion_login_url'], "invite", $request['message'], $property));
        }
    public function generateInviteToken($request)
        {
        $isOtherToken = DB::table('invite_tenants')->where('email', $request['email'])->where('owner', $request['owner'])->where("unit", $request['unit'])->where('completed', false)->first();

        if ($isOtherToken) {
            return $isOtherToken->token;
            }

        $token = Str::random(80);

        $this->storeToken($token, $request);
        return $token;
        }

    public function storeToken($token, $request)
        {
        DB::table('invite_tenants')->insert([
            'email' => $request['email'],
            'owner' => $request['owner'],
            'property' => $request['property'],
            'unit' => $request['unit'],
            'message' => $request['unit'],
            'invite_completion_url' => $request['invite_completion_registration_url'],
            'invite_completion_login_url' => $request['invite_completion_login_url'],
            'token' => $token,
            'created_at' => Carbon::now()
        ]);
        }
    }