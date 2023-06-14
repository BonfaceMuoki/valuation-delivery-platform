<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

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
     $callBackUrl='https://www.b367-102-68-79-173.ngrok-free.app/payments';
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
    public function STKCallBack(Request $request){
        
    }
}
