<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;
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

class ValuerController extends Controller
{
    //
    public function __construct()
    {

        $this->middleware('auth:api', ['except' => ['generateQRCode']]);


    }
    public function uploadReport(Request $request)
    {


        if (auth()->user()) {
            $user = auth()->user();
            if ($user->hasPermissionTo(Permission::where("slug", "upload report")->first())) {
                $validator = Validator::make($request->all(), [
                    'report_description' => 'required|string',
                    'report_uploading_user' => 'required|string',
                    'market_value' => 'required|integer',
                    'forced_market_value' => 'required|integer',
                    'property_lr' => 'required|string',
                    'valuation_date' => 'required|string',
                    'encumberrence_details' => 'required|string',
                    'receiving_company_id' => 'required|string',
                    'report_pdf' => 'required|mimes:pdf|max:2048',
                ]);
                if ($validator->fails()) {
                    return response()->json($validator->errors()->toJson(), 400);
                }
                $file = $request->file("report_pdf");
                $fileName = time() . rand(1, 99) . '.' . $file->extension();
                $file->move(public_path('reports'), $fileName);
                //generate qr code

                //generate qr code
                

            } else {
                return response()->json(['message' => 'unauthorized access'], 401);
            }
        } else {
            return response()->json(['message' => 'Please login'], 401);
        }
    }

    public function generateQRCode(){
        $writer = new PngWriter();
        // Create QR code
        $qrCode = QrCode::create('
        Name  :   Bonface Kyalo
        Phone :  0701717592
        email :  bonny.moki@gmail.com')
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));  
    //         $logo = Logo::create(public_path('reportqr_codes'),'symfony.png')
    // ->setResizeToWidth(50);      
        // Create generic label
        $label = Label::create('Label')
            ->setTextColor(new Color(255, 0, 0));        
        $result = $writer->write($qrCode,null, $label);        
        // Validate the result
        // $writer->validateResult($result, 'Life is too short to be generating QR codes');
        $result->saveToFile(public_path('reportqr_codes/qrcode.png'));
    }
}