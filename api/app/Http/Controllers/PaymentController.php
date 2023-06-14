<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PaymentController extends Controller
{
    //
    public function __construct()
    {
     
    }
    public function generateToken()
    {
        $consumerKey ='EvaxfUFg6J5nZq4oKy8GGA0QcvqkFqgw';
        $consumerSecret ='lN3OD3VunjKouNUe';
        $url ='https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        $response=Http::withBasicAuth($consumerKey, $consumerSecret)->get($url);
        return $response;
    }
    public function intiateSTKpush(Request $request){
     $getaccessToken=json_decode($this->generateToken(),true);
     $accessToken=$getaccessToken['access_token'];
     $url='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
     $passKey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
     $businessShortCode=174379;
     $timeStamp=Carbon::now()->format('YmdHms');
     $password=base64_encode($businessShortCode.$passKey.$timeStamp);
     $transactionType='CustomerPayBillOnline';
     $amount=1;
     $partyA=254740857767;
     $partyB=174379;
     $phoneNumber=254740857767;
     $callBackUrl=env('NGROK_BASE_URL').'/mpesa-payments/stk-push-callback';
     $accountRefrence='Prowiz LTD';
     $transactionDescription='Payment for Goods';
     $response=Http::withToken($accessToken)->post($url,[
        'BusinessShortCode'=>$businessShortCode,
        'Password'=>$password,
        'Timestamp'=>$timeStamp,
        'TransactionType'=>$transactionType,
        'Amount'=>$amount,
        'PartyA'=>$partyA,
        'PartyB'=>$partyB,
        'PhoneNumber'=>$phoneNumber,
        'CallBackURL'=>$callBackUrl,
        'AccountReference'=>$accountRefrence,
        'TransactionDesc'=>$transactionDescription
     ]);
    //  var_dump($response);
    return $response;
    

    }
    public function STKCallBack(Request $request)
    {

        $data=$request->all();
        // File::put($filePath, $data);
        Storage::disk('local')->put('stk.txt',json_encode($data));

        // $data = file_get_contents("php://input");   
        // // $filePath = public_path('stk.txt');         
        // // File::put($filePath, $data);
        // Storage::disk('local')->put('stk.txt',$data);
    }
    public function STKQuery(){
     $getaccessToken=json_decode($this->generateToken(),true);
     $accessToken=$getaccessToken['access_token'];
     $passKey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
     $url='https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';
     $businessShortCode=174379;
     $timeStamp=Carbon::now()->format('YmdHms');
     $password=base64_encode($businessShortCode.$passKey.$timeStamp);
     $CheckoutRequestID='ws_CO_14062023122356429740857767';
     $response=Http::withToken($accessToken)->post($url,[
        'BusinessShortCode'=>$businessShortCode,
        'Password'=>$password,
        'Timestamp'=>$timeStamp,
        'CheckoutRequestID'=>$CheckoutRequestID,
     ]);
     return $response;

    }
    public function registerC2B(){
        $getaccessToken=json_decode($this->generateToken(),true);
        $accessToken=$getaccessToken['access_token'];
        $passKey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
        $url='https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
        $businessShortCode=600987;
        $timeStamp=Carbon::now()->format('YmdHms');
        $password=base64_encode($businessShortCode.$passKey.$timeStamp);
        $responseType="completed";
        $validationURL=env('NGROK_BASE_URL').'/payments/ctob-validation';
        $confirmationURL=env('NGROK_BASE_URL').'/payments/ctob-confirmation';
        $response=Http::withToken($accessToken)->post($url,[
            'ShortCode'=>$businessShortCode,
            'ResponseType'=>$responseType,
            'Password'=>$password,
            'ValidationURL'=>$validationURL,
            'ConfirmationURL'=>$confirmationURL
         ]);
         return $response;

    }
    public function registerC2BValidation(Request $request)
    {

        $data=$request->all();
        // File::put($filePath, $data);
        Storage::disk('local')->put('validation.txt',json_encode($data));
        return response()->json([
           'ResultCode'=>0,
           'ResultDesc'=>'Accepted'
        ]);
        // return response()->json([
        //     'ResultCode'=>'C2B0001',
        //     'ResultDesc'=>'Accepted'
        //]);
    }
    public function registerC2BConfirmation(Request $request)
    {

        $data=$request->all();
        // File::put($filePath, $data);
        Storage::disk('local')->put('confirmation.txt',json_encode($data));
        // $data = file_get_contents("php://input");   
        // // $filePath = public_path('stk.txt');         
        // // File::put($filePath, $data);
        // Storage::disk('local')->put('stk.txt',$data);
    }
    public function Simulate(){
        $getaccessToken=json_decode($this->generateToken(),true);
        $accessToken=$getaccessToken['access_token'];
        $passKey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
        $url='https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
        $businessShortCode=600987;
        $CommandID="CustomerPayBillOnline"; 
        $Amount=1;
        $Msisdn=254708374149;
        $BillRefNumber='000';
        // CustomerPayBuyGoodsOnline
        $timeStamp=Carbon::now()->format('YmdHms');
        $password=base64_encode($businessShortCode.$passKey.$timeStamp);
        $response=Http::withToken($accessToken)->post($url,[
            'ShortCode'=>$businessShortCode,
            'CommandID'=>$CommandID,
            'Amount'=>$Amount,
            'Msisdn'=>$Msisdn,
            'BillRefNumber'=>$BillRefNumber
         ]);
         return $response;

    }
}
