<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;
use Validator;
use setasign\Fpdi\Fpdi;

class ValuerController extends Controller
{
    //
    public function __construct()
    {
        
        $this->middleware('auth:api', ['except' => ['writeToPDF']]);
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
                

            } else {
                return response()->json(['message' => 'unauthorized access'], 401);
            }
        } else {
            return response()->json(['message' => 'Please login'], 401);
        }
    }
    public function writeToPDF(Request $request)
    {
        $filePath = public_path("reports/168188001223.pdf");
        $outputFilePath = public_path("reports/168188001223_output.pdf");
        $this->fillPDFFile($filePath, $outputFilePath);          
        return response()->file($outputFilePath);
    }
  
    /**
     * Write code on Method
     *
     *
     */
    public function fillPDFFile($file, $outputFilePath)
    {
        $fpdi = new FPDI;
          
        $count = $fpdi->setSourceFile($file);
  
        for ($i=1; $i<=$count; $i++) {
  
            $template = $fpdi->importPage($i);
            $size = $fpdi->getTemplateSize($template);
            $fpdi->AddPage($size['orientation'], array($size['width'], $size['height']));
            $fpdi->useTemplate($template);
              
            $fpdi->SetFont("helvetica", "", 15);
            $fpdi->SetTextColor(153,0,153);
  
            $left = 10;
            $top = 10;
            $text = "Verification_Code";
            $fpdi->Text($left,$top,$text);
  
            $fpdi->Image(public_path("reports/proptech.png"), 0, 0);
        }
  
        return $fpdi->Output($outputFilePath, 'F');
    }

}