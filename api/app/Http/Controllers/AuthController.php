<?php
namespace App\Http\Controllers;

use App\Mail\SendTenantEmail;
use App\Models\ClientRegistrationRequests;
use App\Models\ReportConsumer;
use App\Models\ValuationFirmRegistrationRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Models\Role;
use Mockery\Exception;
use App\Models\Property;
use App\Models\Organization;
use Validator;
use DB;
use Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Http\Response;
use App\Models\ValuationFirmInvite;
use App\Models\ValuerfirmUserInvite;
use App\Models\AccesorInvite;
use App\Models\AccesorUserInvite;
use Illuminate\Support\Facades\Http;
use App\Models\PasswordReset;
use App\Mail\SendPasswordResetMail;
class AuthController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', [
            'except' => [
                'registertenant',
                'login',
                'register',
                'registerValuerUser',
                'allUsers',
                'registerAccesor',
                'retrieveValuerInviteDetails',
                'retrieveAccesorInviteDetails',
                'retrieveValuerUserInviteDetails',
                'retrieveAccesorUserInviteDetails',
                'registerAccesorUser',
                'requestValuerAccess',
                'requestAccesorAccess',
                'SendAccountPasswordResetLink',
                'verifyResetToken',
                'ResetPassword'
            ]
        ]);
    }
    public function VarifyRecaptchaToken($request){
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('GOOGLE_SITE_KEY'),
            'response' => $request->recaptcha_token,
        ]);
        return $response;
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
  
     public function requestValuerAccess(Request $request){
        $validator = Validator::make($request->all(), [
            'login_email' => 'required|email|unique:valuation_firm_registration_requests,invite_email',
            'recaptcha_token' => 'required|string',
            'phone_number' => 'required|string',
            'directors_isk_numer' => 'required|string|unique:valuation_firm_registration_requests,isk_number',
            'directors_vrb_numer' => 'required|string|unique:valuation_firm_registration_requests,vrb_number',
            'full_names'=>'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
       $response=$this->VarifyRecaptchaToken($request);

        if ($response->successful()) {
            $data = $response->json();
            // Process the response data
            if ($data['success']) {               
                // reCAPTCHA validation passed
                $requesaccess['invite_email']=$request->login_email;
                $requesaccess['invite_phone']=$request->phone_number;
                $requesaccess['isk_number']=$request->directors_isk_numer;
                $requesaccess['vrb_number']=$request->directors_vrb_numer;
                $requesaccess['valauaion_firm_name']=$request->company_name;
                $requesaccess['director_name']=$request->full_names;
                $invite = ValuationFirmRegistrationRequests::create( $requesaccess);
                if($invite){
                    return response()->json(['message'=>"Request send succefully. You will get an email to the email you provided once the approval has been made." ], 201);
                }else{
                    return response()->json(['message'=>"Failed.Please contact admin" ], 422);            
                }                
                // Proceed with your desired logic
            } else {
                $statusCode = $response->status();
                return response()->json(['message'=>"Failed. Invalid recaptcha code.".json_encode($data),'secret'=>env('GOOGLE_SITE_KEY'),'app_name'=>env('APP_NAME') ], 422);
                // reCAPTCHA validation failed
                // Handle the validation failure
            }
        } else {
            // Request to Google reCAPTCHA API failed
            $statusCode = $response->status();
            return response()->json(['message'=>"Failed. Invalid recaptcha code." ], 422);
            // Handle the error
        }
        
     }


     public function requestAccesorAccess(Request $request){
        $validator = Validator::make($request->all(), [
            'login_email' => 'required|email|unique:valuation_firm_registration_requests,invite_email',
            'recaptcha_token' => 'required|string',
            'phone_number' => 'required|string',
            'full_names'=>'required',
            'institution_name'=>'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
       $response=$this->VarifyRecaptchaToken($request);

        if ($response->successful()) {
            $data = $response->json();
            // return response()->json(['message'=>"Failed. Invalid recaptcha code.". json_encode($data) ], 422);
            // Process the response data
            if ($data['success']) {               
                // reCAPTCHA validation passed
                try{
                    DB::beginTransaction();
                    $requesaccess['invite_email']=$request->login_email;
                    $requesaccess['contact_person_phone']=$request->phone_number;
                    $requesaccess['contact_person_name']=$request->full_names;
                    $requesaccess['institution_name']=$request->institution_name;                
                    $invite = ClientRegistrationRequests::create( $requesaccess);
                    DB::commit();
                    if($invite){
                        return response()->json(['message'=>"Request send succefully. You will get an email to the email you provided once the approval has been made." ], 201);
                    }else{
                        return response()->json(['message'=>"Failed.Please contact admin" ], 422);            
                    } 


                }catch(Exception $exp){
                    DB::rollBack();
                    return response()->json(['message'=>"Failed.".$exp->getMessage() ], 422);
                }
               
                // Proceed with your desired logic
            } else {
                $statusCode = $response->status();
                return response()->json(['message'=>"Failed. Invalid recaptcha code.".$statusCode ], 422);
                // reCAPTCHA validation failed
                // Handle the validation failure
            }
        } else {
            // Request to Google reCAPTCHA API failed
            $statusCode = $response->status();
            return response()->json(['message'=>"Failed. Invalid recaptcha code." ], 422);
            // Handle the error
        }
        
     }
     public function verifyResetToken(Request $request){
        $verified=PasswordReset::where("token",$request->reset_token)->first();
        if($verified!=null){
            return response()->json($verified,200);
        }else{
            return response()->json($verified,404);
        }
     }
     public function ResetPassword(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'reset_token' => 'required|exists:password_resets,token',
        ]);
        if ($validator->fails()) {
            return response()->json(['backenderrors'=>$validator->errors()], 422);
        }
        try {
            DB::beginTransaction();
            //update user
            User::where("email", $request->email)->update(['password' => bcrypt($request->password)]);             
            //update user
            DB::commit();
            return response()->json(['message' => 'Password updated successfully.'], 201);
        } catch (Exception $exp) {
            DB::rollBack();
            return response()->json(['message' => 'Failed.' . $exp->getMessage()], 422);
        }
     

     }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $isactive = User::where("is_active", 1)->where("email", $request->email)->first();
        if ($isactive != null) {
            //verify token
            $response = $this->VarifyRecaptchaToken($request);
            if ($response->successful()) {
                $data = $response->json();
                // Process the response data
                if ($data['success']) {
                    if ($isactive != null) {
                        if (!$token = auth()->attempt($validator->validated())) {
                            return response()->json(['error' => 'Unauthorized'], 401);
                        }
                        return $this->createNewToken($token);
                    } else {
                        return response()->json(['message' => 'Your account is not active'], 403);
                    }
                } else {
                    $statusCode = $response->status();
                    return response()->json(['message' => "Failed. Invalid recaptcha code."], 422);
                    // reCAPTCHA validation failed
                    // Handle the validation failure
                }

            } else {

                // Request to Google reCAPTCHA API failed
                $statusCode = $response->status();
                return response()->json(['message' => "Failed. Invalid recaptcha code.".$response], 422);
                // Handle the error
            }
        }



    }
    public function generatePasswordResetToken($request)
    {
        $token = Str::random(80);
        return $token;
    }

    public function SendAccountPasswordResetLink(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'recaptcha_token' => 'required',
            'reset_link' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        try{
            DB::beginTransaction();
            $isactive = User::where("is_active", 1)->where("email", $request->email)->first();
            if ($isactive != null) {
                //verify token
                $response=$this->VarifyRecaptchaToken($request);
                if ($response->successful()) {
                    $data = $response->json();
                    // Process the response data
                    if ($data['success']) {               
                        // reCAPTCHA validation passed
                         //send reset mail
                        $token=$this->generatePasswordResetToken($request);
                        $saverequest['email']=$request->email;
                        $saverequest['token']=$token;   
                        $mailsend= Mail::to($request['email'])->send(new SendPasswordResetMail($token,$isactive,$request->reset_link));           
                       //send reset mail
                        $passwordreset = PasswordReset::insert($saverequest);
                        DB::commit();
                        if($passwordreset){
                            return response()->json(['message'=>"Request send succefully. We have send you a reset Link on your email." ], 201);
                        }else{
                            return response()->json(['message'=>"Failed.Please contact admin" ], 422);            
                        }                
                        // Proceed with your desired logic
                    } else {
                        $statusCode = $response->status();
                        return response()->json(['message'=>"Failed. Invalid recaptcha code." ], 422);
                        // reCAPTCHA validation failed
                        // Handle the validation failure
                    }
                } else {
                    
                    // Request to Google reCAPTCHA API failed
                    $statusCode = $response->status();
                    return response()->json(['message'=>"Failed. Invalid recaptcha code." ], 422);
                    // Handle the error
                }
    
                //verify token
               
            } else {
                 return response()->json(['message'=>'Your account does not exist or it has been deactivated.Please contact admin'],403);
            }  
        }catch(Exception $exp){
            DB::rollBack();
            return response()->json(
                [
                    'message'=>'Failed.'.$exp->getMessage()
                ], 422); 
        }
   
    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'register_as' => 'required|in:Super Admin,Report Uploader,Uploaders Accesser,Report Uploader Admin,Valuation Firm Director',
            'full_name' => 'required|string|between:2,100',
            'email' => 'required|string|between:2,100|unique:users',
            'isk_number' => 'required|string|unique:organizations',
            'vrb_number' => 'required|unique:organizations,directors_vrb|unique:users',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
            'password_confirmation' => 'required|same:password'
        ]);
        if ($validator->fails()) {
            return response()->json(["message"=>"Unprocessable data","backendvalerrors"=>$validator->errors()], 400);
        }
        $user = [];
        try {
            DB::beginTransaction();

            $organization = null;
            $user=null;
            if (strtolower($request->post('register_as')) == 'report uploader admin') {
                $user = User::create(
                    [
                        'full_name' => $request->full_name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password)
                    ]
                );
                $uploaderadmin_role = Role::where('slug', 'report uploader admin')->first();
                $user->roles()->attach($uploaderadmin_role);
                //check if organization exist
                $validator = Validator::make($request->all(), [
                    'company_name' => 'required|string|between:2,100',
                    'organization_phone' => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10|unique:organizations',
                    'directors_vrb' => 'required|string|unique:organizations',
                    'isk_number' => 'required|string|max:100|unique:organizations'
                ]);
                if ($validator->fails()) {
                    return response()->json($validator->errors()->toJson(), 400);
                }
                $company['organization_name'] = $request->post('company_name');
                $company['organization_phone'] = $request->post('organization_phone');
                $company['organization_email'] = $request->post('company_email');
                $company['directors_vrb'] = $request->post('directors_vrb');
                $company['isk_number'] = $request->post('isk_number');
                $organization=Organization::where($company)->first();
                if(!$organization){
                    $company['created_by'] = $user->id;
                    $organization = Organization::create($company);
                    $organization->users()->attach($user);
                }else{
                    $organization->users()->attach($user);
                }
                //check if organization exist
            }else if(strtolower($request->post('register_as')) == 'report uploader'){
              //get admin account user
              if(auth()->user()==null){
                 return response()->json([
                    'code'=>0,
                    'message'=>'Unauthorized access'
                 ],401);
              }else{
                $user = User::create(
                    [
                        'full_name' => $request->full_name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password)
                    ]
                );
                $uploader_role = Role::where('slug', 'report uploader')->first();
                $user->roles()->attach($uploader_role);
                //
                $loggeduser=auth()->user();
                $organizations=$loggeduser->UploaderOrganization()->get();
                $organization=$organizations[0];
                $organization->users()->attach($user);
                //

              }
            }
            else if(strtolower($request->post('register_as')) == 'valuation firm director'){

            }else if(strtolower($request->post('register_as')) == 'super admin'){
                $user = User::create(
                    [
                        'full_name' => $request->full_name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password)
                    ]
                );
                $superadmin_role = Role::where('slug', 'super admin')->first();
                $user->roles()->attach($superadmin_role);
            }
            DB::commit();
            return response()->json([
                'message' => 'Account has been created successfully',
                'user' => $user,
                'roles' => $user->roles()->get()
            ], 201);


        } catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Account has not been created successfully '.$exp->getMessage(),
                
            ], 400);

        }

    }
    public function registerAccesorUser(Request $request){
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|between:2,100',
            'email' => 'required|string|between:2,100|unique:users',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
            'password_confirmation' => 'required|same:password'
        ]);
        if ($validator->fails()) {
            return response()->json(["message"=>"Unprocessable data","backendvalerrors"=>$validator->errors()], 400);
        }
        $user = [];
        try {
            DB::beginTransaction();
            $user = User::create(
                [
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password)
                ]
            );
            $accesor_role = Role::where('id', $request->register_as)->first();
            $user->roles()->attach($accesor_role);
            $organization=ReportConsumer::where("id",$request->organization)->first();
            $organization->users()->attach($user);
            AccesorUserInvite::where("invite_token",$request->invite_token)->update(['status'=>1]);
            DB::commit();
            return response()->json([
                'message' => 'Account has been created successfully',
            ], 201);
        } catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Account has not been created successfully '.$exp->getMessage(),
                
            ], 400);

        }

    }
    public function registerValuerUser(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|between:2,100',
            'email' => 'required|string|between:2,100|unique:users',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
            'password_confirmation' => 'required|same:password'
        ]);
        if ($validator->fails()) {
            return response()->json(["message"=>"Unprocessable data","backendvalerrors"=>$validator->errors()], 400);
        }
        $user = [];
        try {
            DB::beginTransaction();

            $user = User::create(
                [
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password)
                ]
            );
            $uploader_role = Role::where('id', $request->register_as)->first();
            $user->roles()->attach($uploader_role);
            $organization=Organization::where("id",$request->organization)->first();
            $organization->users()->attach($user);


            ValuerfirmUserInvite::where("invite_token",$request->invite_token)->update(['status'=>1]);

            DB::commit();
            return response()->json([
                'message' => 'Account has been created successfully',
            ], 201);


        } catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Account has not been created successfully '.$exp->getMessage(),
                
            ], 400);

        }

    }
public function registerAccesor(Request $request){

    $validator = Validator::make($request->all(), [
        'register_as' => 'required|in:Report Accessor,Report Accessor Admin',
        'full_name' => 'required|string|between:2,100',
        'email' => 'required|string|between:2,100',
        'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
        'password_confirmation' => 'required|same:password'
    ]);
    if ($validator->fails()) {
        return response()->json($validator->errors()->toJson(), 400);
    }
    $user = [];
    try {
        DB::beginTransaction();

        $organization = null;
        $organizations = null;
        $user=null;
        if (strtolower($request->post('register_as')) == 'report accessor admin') {
            $user = User::create(
                [
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password)
                ]
            );
            $uploaderadmin_role = Role::where('slug', 'report accessor admin')->first();
            $user->roles()->attach($uploaderadmin_role);
            //check if organization exist
            $validator = Validator::make($request->all(), [
                'company_name' => 'required|string|between:2,100',
                'organization_phone' => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10|unique:report_consumers',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }
            $company['organization_name'] = $request->post('company_name');
            $company['organization_phone'] = $request->post('organization_phone');
            $company['organization_email'] = $request->post('company_email');
            $company['organization_type'] = $request->post('accessor_type');
            $organization=ReportConsumer::where($company)->first();
            if(!$organization){
                $company['created_by'] = $user->id;
                $organization = ReportConsumer::create($company);

                $organization->users()->attach($user);


            }else{
                $organization->users()->attach($user);
            }
            //check if organization exist
        }else if(strtolower($request->post('register_as')) == 'report accessor'){
          //get admin account user
          if(auth()->user()==null){
             return response()->json([
                'code'=>0,
                'message'=>'Unauthorized access'
             ],401);
          }else{
            $user = User::create(
                [
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password)
                ]
            );
            //
            $loggeduser=auth()->user();
            $organizations=$loggeduser->AccessorOrganization()->get();
            $organization=$organizations[0];
            $organization->users()->attach($user);
            //

          }
        }
        else if(strtolower($request->post('register_as')) == 'valuation firm director'){

        }
        DB::commit();
        return response()->json([
            'message' => 'Account has been created successfully',
            'organization_d_u' => $user->UploaderOrganization()->get(),
            'organization_d_a' => $user->AccessorOrganization()->get(),
            'user' => $user
        ], 201);


    } catch (\Exception $exp) {
        DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
        return response()->json([
            'message' => 'Account has mot been created successfully',
            'error' => $exp
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
    public function userProfileDetails(Request $request)
    {
        $user=User::where("id",$request->user_id)->first();
        if($user!=null){
          
                $role=  $user->roles()->first(["id", "name","name as role_name"]);   
                $userid=['user_id'=>$request->user_id];  
                return response()->json([
                    'user' => array_merge($user->toArray(),$role->toArray(),$userid),
                    'role' => $role,
                    'user_id' => $user,
                    'roles' => $user->roles()->get(["id", "name"]),
                    'permissions' => array_merge($role->permissions()->get(['id','slug as name'])->toArray())
                ]);
    
        }else{
            return response()->json(['message'=>'user not found'],404);
          
        }

   
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
        } catch (Exception $e) {
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
        $role=auth()->user()->roles()->first(["id", "name","name as role_name"]);
        $userid=['user_id'=>auth()->user()->id];
        $user=auth()->user();
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => array_merge($user->toArray(),$role->toArray(),$userid),
            'role' => $role,
            'user_id' => $user,
            'roles' => $user->roles()->get(["id", "name"]),
            'permissions' => array_merge($user->permissions()->get(["id", "slug as name"])->toArray(),$role->permissions()->get(['id','slug as name'])->toArray())
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
    public function allUsers()
    {
        return response()->json(["users" => User::all()]);
    }

    public function retrieveValuerInviteDetails(Request $request){

       $detailss= ValuationFirmInvite::where("invite_token",$request->invite_token)->where("completed",0)->first();
       return response()->json($detailss,200);

    }
    public function retrieveValuerUserInviteDetails(Request $request){
     $details=ValuerfirmUserInvite::where("invite_token",$request->invite_token)
     ->join("organizations","organizations.id","=","valuerfirm_user_invites.organization_id")
     ->where("valuerfirm_user_invites.status",0)->first();
     return response()->json($details,200);
    }
    public function retrieveAccesorInviteDetails(Request $request){

        $detailss= AccesorInvite::where("invite_token",$request->invite_token)->first();
        return response()->json($detailss,200); 
        
    }
    public function retrieveAccesorUserInviteDetails(Request $request){
        $details=AccesorUserInvite::where("invite_token",$request->invite_token)
        ->join("report_consumers","report_consumers.id","=","accesor_user_invites.report_consumer_id")
        ->where("accesor_user_invites.status",0)->first();
        return response()->json($details,200);
    }
}