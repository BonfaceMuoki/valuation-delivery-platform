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

class AccesorController extends Controller
{
    //
    public function __construct()
    {

        $this->middleware('auth:api', ['except' => ['generateQRCode']]);


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
}