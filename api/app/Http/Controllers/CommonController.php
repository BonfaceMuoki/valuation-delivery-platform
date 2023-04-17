<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\ReportConsumer;
use Illuminate\Http\Request;

class CommonController extends Controller
{
    //
    public function getAccesorsList(){
        $all=ReportConsumer::asll();
        return response()->json(['code'=>1,'accesors'=>$all],201);
    }
    public function getAccesorsUsersList($accesor){
        $org=ReportConsumer::where("id",$accesor)->first();
        if($org){
            return response()->json(['code'=>1,'users_list'=>$org->users()->get()],201);
   
        }else{
            return response()->json(['code'=>0,'users_list'=>null,'message'=>'Organization is not found'],201);
        }
    }
    public function getUploadersList(){
        $all=Organization::all();
        return response()->json(['code'=>1,'accesors'=>$all],201);
    }
    public function getUploadersUsersList($uploader){
        $org=Organization::where("id",$uploader)->first();
        if($org){
            return response()->json(['code'=>1,'users_list'=>$org->users()->get()],201);
   
        }else{
            return response()->json(['code'=>0,'users_list'=>null,'message'=>'Organization is not found'],201);
        }
        }
}
