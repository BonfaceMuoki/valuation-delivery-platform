<?php

namespace App\Http\Controllers;

use App\Models\AccesorInvite;
use App\Models\ArchiveClientRegistartionRequest;
use App\Models\ArchiveValuerAccessRequest;
use App\Models\ClientRegistrationRequests;
use App\Models\Organization;
use App\Models\ReportConsumer;
use App\Models\ValuationFirmInvite;
use App\Models\ValuationFirmRegistrationRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Role;
use App\Models\Permission;
use DB;
use Mail;
use Symfony\Component\HttpFoundation\Test\Constraint\RequestAttributeValueSame;
use Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\SendValuationFirmInviteMail;
use App\Mail\SendAccesorInviteMail;
use App\Mail\SendCompanyRegistrationRequestDeclineMail;

use Mockery\Exception;

class AdminController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware("Admin")->except(['getAllRoles']);

    }
    public function getDashboard(Request $request){
     $valuationfirms=Organization::count();
     $accesors=ReportConsumer::count();
     return response()->json(['allvaluers' => $valuationfirms,'allaccesors'=>$accesors], 200);     
    }
    public function deleteRole($id){
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add role")->first())) {
            try {
                DB::beginTransaction();                  
                $role = Role::findOrFail($id);
                $rolede=Role::where("id",$id)->first();
                $rolede->permissions()->detach();
                $role->permissions()->detach();
                $role->delete();               
                DB::commit();
                return response()->json([
                    'message' => 'Deleted successfully.'
                ], 201);
             
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.'.$exception->getMessage().'.Please contact admin.',
                    'error' => $exception,
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function updateRole(Request $request,$id){
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add role")->first())) {
            try {
                DB::beginTransaction();   

                $roleup['name'] = $request->role_name;
                $roleup['slug'] = strtolower($request->role_name);
                $roleup['status'] = 1;

                
                $role = Role::findOrFail($id);
                $role->fill($roleup);
                $role->save();                 
                DB::commit();
                return response()->json([
                    'message' => 'Updated successfully.'
                ], 201);
             
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.'.$exception->getMessage().'.Please contact admin.',
                    'error' => $exception,
                    'payload' => $request->all()
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function addRoles(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add role")->first())) {
            try {
                DB::beginTransaction();
                $roles = json_decode(stripslashes($request->post('role_name')), true);
                foreach ($roles as $role) {
                    $role['name'] = $request->post('role_name');
                    $role['slug'] = strtolower($request->post('role_name'));
                    $role['status'] = 1;
                    Role::create($role);
                }
                DB::commit();
              
                    return response()->json([
                        'message' => 'Added successfully.'
                    ], 201);
          
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.Please contact admin.',
                    'error' => $exception
                ], 400);
            }finally{

            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function addPermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add permission")->first())) {
            $validator = Validator::make($request->all(), [
                'permission_name' => 'required|unique:permissions,name',
            ]);
            if ($validator->fails()) {
                return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
            }
            try {
                DB::beginTransaction();
                // $permissions = json_decode(stripslashes($request->post('permission_name')), true);
                // foreach ($permissions as $perm) {
                //     //check if exists
                // $found = Permission::where("name", )->get();
                // if (sizeof($found) == 0) {
                        $permission['name'] = $request->permission_name;
                        $permission['slug'] = strtolower($request->permission_name);
                        $permission['status'] = 1;
                        Permission::create($permission);
                    // }
                    //check if exists

                // }
                DB::commit();
                return response()->json([
                    'message' => 'Added successfully'
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exception->getMessage()
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function attachPermissionsToRole(Request $request)
    {

    }
    public function deactivateUserAccount()
    {

    }
    public function deactivateValuationFirm()
    {

    }
    public function deactivateReportConsumer()
    {

    }
    public function getAllPermissions()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "assign role permission")->first())) {
            return response()->json(Permission::orderBy('name', 'ASC')->get(), 201);
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function getAllRoles()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "view roles")->first())) {

            $roles=Role::with("permissions")->get();            
            return response()->json($roles, 201);
            
        } else if($user->hasPermissionTo(Permission::where("slug", "view valuation firm roles")->first())) {

            $roles=Role::with("permissions")->where('name', 'LIKE', '%uploader%')->get();       

            return response()->json($roles, 201);


        }else if($user->hasPermissionTo(Permission::where("slug", "view accesor firm roles")->first())) {

            $roles=Role::with("permissions")->where('name', 'LIKE', '%accessor%')->get();       
            return response()->json($roles, 201);


        } else {

            return response()->json(['message' => 'Permission Denied'], 401);

        }
    }
    public function assignRolePermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "assign role permission")->first())) {
            try {
                DB::beginTransaction();
                $data = $request->post('permissions');
                //  get role details
                $role = Role::where("id", $request->post('role'))->first();
                $role->permissions()->detach();
                $permissions = $request->post("permissions");
                foreach ($permissions as $permission) {
                    $axist=DB::table("roles_permissions")->where("permission_id",$permission)->where("role_id",$request->post('role'))->get();
                    // if(sizeof($axist)==0){
                        $perm = Permission::where("id", $permission)->first();
                        $role->permissions()->attach($perm);
                    // }
                    
                }
                DB::commit();
                return response()->json([
                    'message' => 'Assigned successfully',
                    'permissions' => $role->permissions()->get()
                ], 201);
                //  get role details
            } catch (\Exception $exp) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exp->getMessage()
                ], 400);
            }

        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }

    }
    public function getRolePermissions(Request $request)
    {
       $roleperms= DB::table("roles_permissions")
            ->join("roles", "roles.id", "=", "roles_permissions.role_id")
            ->join("permissions", "permissions.id", "=", "roles_permissions.permission_id")
            ->select("roles.name as role_name","permissions.name as permission_name","roles_permissions.*")->get();
        // $role = Role::where("id", $request->get('role'))->first();
        return response()->json($roleperms, 200);
    }
  
    public function sendValuationFirmInvite(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users|unique:valuation_firm_invites,invite_email',
            'registration_url' => 'required|url',
            'login_url' => 'required|url',
            'company_name' => 'required',
            'directors_name' => 'required',
            'isk_number' => 'required|unique:organizations',
            'vrb_number' => 'required|unique:organizations,directors_vrb'
        ]);
        if ($validator->fails()) {
            return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
        }
        // If email does not exist

        // If email exists
        $this->sendValuationInviteMail($request->all());
        return response()->json([
            'message' => 'Check your inbox, we have sent a link to reset email.'
        ], Response::HTTP_OK);


    }
    public function sendValuationInviteMail($request)
    {
        $token = $this->generateInviteToken($request);
        Mail::to($request['email'])->send(new SendValuationFirmInviteMail($token,$request['registration_url'],$request['login_url']));
    }
    public function generateInviteToken($request)
    {
        $token = Str::random(80);
        $this->storeToken($token, $request);
        return $token;
    }

    public function storeToken($token, $request)
    {
        DB::table('valuation_firm_invites')->insert([
            'valauaion_firm_name' => $request['company_name'],
            'invite_phone' => $request['invite_phone'],
            'isk_number' => $request['isk_number'],
            'vrb_number' => $request['vrb_number'],
            'director_name' => $request['directors_name'],
            'invite_email' => $request['email'],
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'created_at' => Carbon::now()
        ]);
    }
    //send accesor invite
    public function sendAccesorInvite(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:users|unique:accesor_invites,invite_email',
                'registration_url' => 'required|url',
                'login_url' => 'required|url',
                'accesor_name' => 'required',
                'contact_person_name' => 'required',
                'contact_person_phone' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
            }
            // If email does not exist

            // If email exists
            $this->sendAccesorInviteEMail($request->all());
            DB::commit();
            return response()->json([
                'message' => 'Check your inbox, we have sent a link to reset email.'
            ], Response::HTTP_OK);
        } catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Failed.',
                'error' => $exp->getMessage()
            ], 400);
        }

    }
    public function sendAccesorInviteEMail($request)
    {

        $token = $this->generateAccesorInviteToken($request);
        Mail::to($request['email'])->send(new SendAccesorInviteMail($token,$request['registration_url'],$request['login_url']));

    }
    public function generateAccesorInviteToken($request)
    {
        $token = Str::random(80);
        $this->storeAccesorToken($token, $request);
        return $token;
    }

    public function storeAccesorToken($token, $request)
    {
        DB::table('accesor_invites')->insert([
            'accessor_name' => $request['accesor_name'],
            'contact_person_phone' => $request['contact_person_phone'],
            'contact_person_name' => $request['contact_person_name'],
            'invite_email' => $request['email'],
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'created_at' => Carbon::now()
        ]);
    }
    //close send accesor invite
    public function getValuationAccessRequests(Request $request){
      $allrequests= ValuationFirmRegistrationRequests::all();
      return response()->json($allrequests,200);
    }
   
    public function acceptValuationAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ValuationFirmRegistrationRequests::where("id",$request->request_id)->first();
            $exist = Organization::where("organization_email",$requestde->invite_email)
                ->where("directors_vrb",$requestde->vrb_number)
                ->where("isk_number",$requestde->isk_number)
                ->first();
                if($exist==null){
                    //check if invite is already send
                   $invitesend=ValuationFirmInvite::where("invite_email",$requestde->invite_email)
                    ->where("vrb_number",$requestde->vrb_number)
                    ->where("isk_number",$requestde->isk_number)
                    ->count();
                    if($invitesend>0){
                        return response()->json([
                            'message' => 'Invite already Sent.'
                        ], Response::HTTP_OK); 
                    }else{

                        //close if invite is alredy is send
                    $request['company_name']=$requestde['valauaion_firm_name'];
                    $request['isk_number']=$requestde->isk_number;
                    $request['vrb_number']=$requestde->vrb_number;
                    $request['directors_name']=$requestde->director_name;
                    $request['email']=$requestde->invite_email;
                    $request['registration_url']=$request->registration_url;
                    $request['login_url']=$request->login_url;
                    $request['invite_phone']=$requestde->invite_phone;
                    
                    $this->sendValuationInviteMail($request);
                    //update status
                    ValuationFirmRegistrationRequests::where("id",$request->request_id)->update(['status'=>'Approved']);
                    DB::commit();
                    return response()->json([
                        'message' => 'Check your inbox, we have sent a link to reset email.'
                    ], Response::HTTP_OK); 


                    }
                     
                    //close update status
                }else{

                    return response()->json([
                        'message' => 'The rquest has already been approved.'
                    ], Response::HTTP_OK); 
                }          
               
           

        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
        

    }
    public function archiveValuationAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ValuationFirmRegistrationRequests::where("id",$request->invite)->first()->toArray(); 
            unset($requestde['id']);
            ArchiveValuerAccessRequest::create($requestde);
            ValuationFirmRegistrationRequests::where("id",$request->invite)->delete();
            DB::commit();
            return response()->json([
               'message' => 'Your request has been processed successfully.'
            ], Response::HTTP_OK); 
                    //close update status
        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
    }
    public function rejectValuationAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ValuationFirmRegistrationRequests::where("id",$request->invite)->first();
            $exist = Organization::where("organization_email", )
                ->where("directors_vrb",$requestde->vrb_number)
                ->where("isk_number",$requestde->isk_number)
                ->first();
                if($exist==null){
                   //send email notification
                   Mail::to($requestde->invite_email)->send(new SendCompanyRegistrationRequestDeclineMail($request->reason,$requestde));
                   //send notification                   
                    //update status
                    ValuationFirmRegistrationRequests::where("id",$request->invite)->update(['status'=>'Rejected']);
                    DB::commit();
                    return response()->json([
                        'message' => 'Your request has been processed successfully.'
                    ], Response::HTTP_OK); 
                    //close update status
                }else{

                    return response()->json([
                        'message' => 'The rquest has already been approved.'
                    ], Response::HTTP_OK); 
                }          
               
           

        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
        

    }
    public function getAccesorAccessRequests(Request $request){
        $allrequests= ClientRegistrationRequests::all();
        return response()->json($allrequests,200);
      }

      public function getValuerRequestRegistrationStatus(Request $request){
        $requestde = ValuationFirmRegistrationRequests::where("id",$request->req)->first();
        $found = Organization::where("organization_email", $requestde->invite_email)
        ->where("directors_vrb",$requestde->vrb_number)
        ->where("isk_number",$requestde->isk_number)
        ->count();
        if($found > 0){

            $exist = Organization::where("organization_email",$requestde->invite_email )
            ->where("directors_vrb",$requestde->vrb_number)
            ->where("isk_number",$requestde->isk_number)
            ->first();
            return response()->json(['orgdetails'=>$exist,'request'=>$request->req,'requestdetails'=> $requestde],200);
        }else{
            return response()->json(['orgdetails'=>[],'message'=>'Not found','request'=>$request->req,'requestdetails'=> $requestde],200);
        }
      }


    //   accesor RequestAttributeValueSame
    public function acceptAccesorAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ClientRegistrationRequests::where("id",$request->request_id)->first();
            $exist = ReportConsumer::where("organization_email", $requestde->invite_email)->first();
                if($exist==null){
                    //check if invite is already send
                   $invitesend=AccesorInvite::where("invite_email",$requestde->invite_email)
                    ->count();
                    if($invitesend>0){
                        return response()->json([
                            'message' => 'Invite already Sent.'
                        ], Response::HTTP_OK); 
                    }else{

                        //close if invite is alredy is send
                    $requestacc['accesor_name']=$requestde['institution_name'];
                    $requestacc['contact_person_phone']=$requestde->contact_person_phone;
                    $requestacc['contact_person_name']=$requestde->invite_email;
                    $requestacc['email']=$requestde->invite_email;
                    $requestacc['registration_url']=$request->registration_url;
                    $requestacc['login_url']=$request->login_url;
                    $this->sendAccesorInviteEMail($requestacc);
                    //update status
                    ClientRegistrationRequests::where("id",$request->request_id)->update(['status'=>'Approved']);
                    DB::commit();
                    return response()->json([
                        'message' => 'Check your inbox, we have sent a link to reset email.'
                    ], Response::HTTP_OK); 


                    }
                     
                    //close update status
                }else{

                    return response()->json([
                        'message' => 'The rquest has already been approved.'
                    ], Response::HTTP_OK); 
                }          
               
           

        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
        

    }
    public function archiveAccesorAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ClientRegistrationRequests::where("id",$request->invite)->first()->toArray(); 
            unset($requestde['id']);
            ArchiveClientRegistartionRequest::create($requestde);
            ClientRegistrationRequests::where("id",$request->invite)->delete();
            DB::commit();
            return response()->json([
               'message' => 'Your request has been processed successfully.'
            ], Response::HTTP_OK); 
                    //close update status
        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
    }
    public function rejectAccesorAccessRequest(Request $request){
        try{
            DB::beginTransaction();
            $requestde = ClientRegistrationRequests::where("id",$request->invite)->first();
            $exist = ReportConsumer::where("organization_email", )
                ->where("directors_vrb",$requestde->vrb_number)
                ->where("isk_number",$requestde->isk_number)
                ->first();
                if($exist==null){
                   //send email notification
                   Mail::to($requestde->invite_email)->send(new SendCompanyRegistrationRequestDeclineMail($request->reason,$requestde));
                   //send notification                   
                    //update status
                    ClientRegistrationRequests::where("id",$request->invite)->update(['status'=>'Rejected']);
                    DB::commit();
                    return response()->json([
                        'message' => 'Your request has been processed successfully.'
                    ], Response::HTTP_OK); 
                    //close update status
                }else{

                    return response()->json([
                        'message' => 'The rquest has already been approved.'
                    ], Response::HTTP_OK); 
                }          
               
           

        }catch(Exception $exp){
            DB::rollBack();
            return response()->json([
                'message' => 'Failed.'.$exp->getMessage()
            ],500);
        }
        

    }
      public function getAccesorRequestRegistrationStatus(Request $request){
        $requestde = ClientRegistrationRequests::where("id",$request->req)->first();
        $found = ReportConsumer::where("organization_email", $requestde->invite_email)
        ->count();
        if($found > 0){

            $exist = ReportConsumer::where("organization_email",$requestde->invite_email )
            ->where("directors_vrb",$requestde->vrb_number)
            ->where("isk_number",$requestde->isk_number)
            ->first();
            return response()->json(['orgdetails'=>$exist,'request'=>$request->req,'requestdetails'=> $requestde],200);
        }else{
            return response()->json(['orgdetails'=>[],'message'=>'Not found','request'=>$request->req,'requestdetails'=> $requestde],200);
        }
      }

    //  close accesor requests 
}