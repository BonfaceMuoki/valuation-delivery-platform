<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\ReportConsumer;
use App\Models\ValuationReport;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\User;
use Validator;

use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\ValidationException;

use setasign\Fpdi\Fpdi;
use DB;
use Carbon\Carbon;
use Mail;
use App\Mail\sendAccesorFirUserInviteMail;

use Illuminate\Support\Str;

class AccesorController extends Controller
{
    //
    public function __construct()
    {

        $this->middleware('auth:api', ['except' => ['generateQRCode']]);


    }
    public function AccesorDashboardSummary(Request $request){

        $user=auth()->user();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $organization = $user->AccessorOrganization()->first();
        //total reports
        $allreports=ValuationReport::where("receiving_company_id",$organization->id)->count();
        //close total reports
        // total report this Month reports
        $thismonthsreports=ValuationReport::where("receiving_company_id",$organization->id)->whereMonth('created_at', $currentMonth)
        ->whereYear('created_at', $currentYear)->count();
        // close report this months reports
        // $accesors open served
        $servedaccesors=ValuationReport::where("receiving_company_id",$organization->id)->distinct("receiving_company_id")->count();
        // $accesors close served
        return response()->json(['allreports' => $allreports,'thismonthreports'=>$thismonthsreports,"servedaccesors"=>$servedaccesors], 200);
        
    }
    public function updatePersonalInfromation(Request $request){
        $user = auth()->user();   
        $role=auth()->user()->roles()->first(["id", "name","name as role_name"]);
        $id=$user->id;    
        $userid=['user_id'=>auth()->user()->id];
            try {
                DB::beginTransaction();  
                $userup['full_name'] = $request->full_name;
                $userup['email'] =$request->email;
                $userup['profile_pic'] = $request->isk_number;                
                $userupdate = User::findOrFail(trim($id));
                $userupdate->fill($userup);
                $userupdate->save();                 
                DB::commit();
                $user = auth()->user(); 
                $bearerToken = $request->header('Authorization');
                // $bearerToken should be in the format 'Bearer {token}'            
                // Extract the actual token from the header value
                $token = str_replace('Bearer ', '', $bearerToken);
                $role=auth()->user()->roles()->first(["id", "name","name as role_name"]);
                return response()->json([
                    'message' => 'Updated successfully.',
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'user' => array_merge($userupdate->toArray(),$role->toArray(),$userid),
                    'role' => $role,
                    'user_id' => $user,
                    'roles' => $user->roles()->get(["id", "name"]),
                    'permissions' => array_merge($user->permissions()->get(["id", "slug as name"])->toArray(),$role->permissions()->get(['id','slug as name'])->toArray())
        
                ], 201);
             
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.'.$exception->getMessage().'.Please contact admin.',
                    'error' => $exception,
                    'payload' => $request->all()
                ], 400);
            }
       
    }
   public function  retriveAccesorOrgDetails(){
    $user = auth()->user();    
    try {       
        return response()->json($user->AccessorOrganization()->first()
           , 201);
     
    } catch (\Exception $exception) {
        DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
        return response()->json([
            'message' => 'Failed.'.$exception->getMessage().'.Please contact admin.',
            'error' => $exception
        ], 400);
    }

    }
    public function updateCompanyInfromation(Request $request){
        $user = auth()->user();   
        $role=auth()->user()->roles()->first(["id", "name","name as role_name"]);
        $id=$user->id;  
        $companyinfo=$user->AccessorOrganization()->first();
        $userid=['user_id'=>auth()->user()->id];
            try {
                DB::beginTransaction();  
                $compup['organization_name'] = $request->organization_name;
                $compup['organization_phone'] =$request->organization_phone;
                $compup['organization_email'] = $request->organization_email;              
                $compupdate = ReportConsumer::findOrFail(trim($companyinfo->id));
                $compupdate->fill($compup);
                $compupdate->save();                 
                DB::commit();
                $user = auth()->user();                 
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
       
    }
    public function sendUserInvite(Request $request){
        $user = auth()->user();   
        $role=auth()->user()->roles()->first(["id", "name","name as role_name"]);
        $companyinfo=$user->  AccessorOrganization()->wherePivot("status",1)->first();
        $userid=['user_id'=>auth()->user()->id];
            try {
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email|unique:users|unique:valuerfirm_user_invites,invite_email',
                    'registration_url' => 'required|url',
                    'login_url' => 'required|url',
                    'name' => 'required',
                    'phone' => 'required'
                ]);    
                if ($validator->fails()) {
                    return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
                }
                $user = auth()->user(); 
                DB::beginTransaction();  
                //send mail
                $organization=$user->AccessorOrganization()->wherePivot("status",1)->first();
                $this->sendUserInviteMail($request->all(),$organization);
                //send mail                                
                DB::commit();
                                
                return response()->json([
                    'message' => 'Updated successfully.',
                    'data' => $request->all()
                ], 201);
             
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.'.$exception->getMessage().'.Please contact admin.',
                    'error' => $exception,
                    'payload' => $request->all()
                ], 400);
            }
    }
    public function sendUserInviteMail($request,$org){
        $token = $this->generateAccesorInviteToken($request,$org);
         $user=auth()->user();
        Mail::to($request['email'])->send(new sendAccesorFirUserInviteMail($token,$request['registration_url'],$request['login_url'],$user,$request));
   
    }

    public function generateAccesorInviteToken($request,$org)
    {
        $token = Str::random(80);
        $this->storeAccesorToken($token, $request,$org);
        return $token;
    }

    public function storeAccesorToken($token, $request,$org)
    {      
        DB::table('accesor_user_invites')->insert([
            'role_id' => $request['invited_as'],
            'full_name'=>$request['name'],
            'report_consumer_id' => $org->id,
            'invite_email' => $request['email'],
            'personal_phone' => $request['phone'],
            'personal_email' => $request['email'],            
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'created_at' => Carbon::now()
        ]);
    }
}