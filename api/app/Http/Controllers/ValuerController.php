<?php

namespace App\Http\Controllers;

use App\Mail\sendReportAccessMail;
use App\Mail\sendReportApprovalMail;
use App\Mail\sendValuationFirUserInviteMail;
use App\Models\CachedReport;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\ReportSignatories;
use App\Models\ReportUser;
use App\Models\User;
use App\Models\ValuationReport;
use Carbon\Carbon;
use DB;
// use Endroid\QrCode\Color\Color;
// use Endroid\QrCode\Encoding\Encoding;
// use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
// use Endroid\QrCode\Label\Label;
// use Endroid\QrCode\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Mail;
use Mockery\Exception;
use setasign\Fpdi\Fpdi;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Storage;
use Validator;

class ValuerController extends Controller
{
    //
    public function __construct()
    {

        $this->middleware('auth:api', ['except' => ['generateQRCode', 'download']]);

    }
    public function donwloadCachedImage(Request $request)
    {
        try {

            $myFile = public_path("reports_cached/" . $request->file . "");

            return response()->download($myFile, $request->file, ['Content-Type' => 'application/pdf']);

        } catch (Exception $exp) {
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }
    }
    public function getCurrentUploadedFile(Request $request)
    {
        if (auth()->user()) {
            $user = auth()->user();
            $orgdetails = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            $record = CachedReport::where(
                ['user_id' => $user->id,
                    'organization_id' => $orgdetails->id,
                ])->first();
            return response()->json(['file_name' => $record->file_name, 'uploaded_name' => $record->file_name, 'cached' => $record->file_name], 200);
        }
    }
    public function uploadCachedReportDoc(Request $request)
    {
        if (auth()->user()) {
            $user = auth()->user();
            $orgdetails = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            $file = $request->file("report_pdf");
            $currently_exists_file = CachedReport::where(
                [
                    'user_id' => $user->id,
                    'organization_id' => $orgdetails->id,
                ])->exists();
            if ($currently_exists_file) {
                $record = CachedReport::where(
                    ['user_id' => $user->id,
                        'organization_id' => $orgdetails->id,
                    ])->first();
                // remove the file first
                $filePath = 'reports_cached/' . $record->file_name;
                $msg = "";
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                    // File exists and has been deleted
                }
                // remove the file first
                // add new file
                $fileName = time() . rand(1, 99) . '.' . $file->extension();
                $file = $request->file('report_pdf');
                $path = $file->storeAs('reports_cached', $request->report_pdf->getClientOriginalName(), 'public');
                // add new file
                // save the file to db
                $updatedfile = CachedReport::where("id", $record->id)->update(
                    ['recipient_id' => $request->recipient,
                        'propertyLR' => $request->lrnumber,
                        'file_name' => $file->getClientOriginalName(),
                    ]);
                // save the file to db
                return response()->json(['file_name' => $fileName, 'uploaded_name' => $file->getClientOriginalName(), 'cached' => $updatedfile, "message" => $msg], 200);
            } else {
                $exists = CachedReport::where(
                    ['recipient_id' => $request->recipient,
                        'user_id' => $user->id,
                        'propertyLR' => $request->lrnumber,
                        'organization_id' => $orgdetails->id])->exists();
                $file = $request->file('report_pdf');
                $fileName = $request->report_pdf->getClientOriginalName();
                $path = $file->storeAs('reports_cached', $request->report_pdf->getClientOriginalName(), 'public');
                $cached = CachedReport::create(['propertyLR' => $request->lrnumber, 'recipient_id' => $request->recipient, 'user_id' => $user->id, 'organization_id' => $orgdetails->id, 'file_name' => $file->getClientOriginalName()]);
                return response()->json(['file_name' => $fileName, 'uploaded_name' => $file->getClientOriginalName(), 'cacheds' => $cached], 200);
            }

        } else {
            return response()->json(["message" => "Permission Denied"], 500);
        }

    }
    public function ValuerDashboardSummary(Request $request)
    {

        $user = auth()->user();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $organization = $user->UploaderOrganization()->first();
        //total reports
        $allreports = ValuationReport::where("report_uploading_from", $organization->id)->count();
        //close total reports
        // total report this Month reports
        $thismonthsreports = ValuationReport::where("report_uploading_from", $organization->id)->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)->count();
        // close report this months reports
        // $accesors open served
        $servedaccesors = ValuationReport::where("report_uploading_from", $organization->id)->distinct("receiving_company_id")->count();
        // $accesors close served
        return response()->json(['allreports' => $allreports, 'thismonthreports' => $thismonthsreports, "servedaccesors" => $servedaccesors], 200);

    }
    public function uploadValuationReport(Request $request)
    {

        $file = $request->file("report_pdf");
        $fileName = time() . rand(1, 99) . '.' . $file->extension();
        $file->move(public_path('reports'), $fileName);

        return response()->json(['file_name' => $fileName], 200);
    }
    public function uploadReport(Request $request)
    {

        if (auth()->user()) {
            $user = auth()->user();
            if ($user->hasPermissionTo(Permission::where("slug", "upload report")->first())) {
                $validator = Validator::make($request->all(), [
                    'propertyDescription' => 'required|string',
                    'marketValue' => 'required|integer',
                    'forcedSaleValue' => 'required|integer',
                    'annualGrossVRevenue' => 'required|integer',
                    'totalBultUpArea' => 'required|integer',
                    'landSize' => 'required|integer',
                    'tenure' => 'required|string',
                    'propertyLR' => 'required|string',
                    'propertyType' => 'required|string',
                    'valuationDate' => 'required|string',
                    'instructionDate' => 'required|string',
                    'e_location_name' => 'required|string',
                    'e_location_county' => 'required|string',
                    'e_location_town' => 'required|string',
                    'e_location_street' => 'required|string',
                    'e_location_neighbourhood' => 'required|string',
                    'a_location_lat' => 'required|string',
                    'a_location_long' => 'required|string',
                    'a_location_city' => 'required|string',
                    'a_location_town' => 'required|string',
                    'a_location_street' => 'required|string',
                ]);
                if ($validator->fails()) {
                    return response()->json(["message" => "Unprocessable data", "backendvalerrors" => $validator->errors()], 422);
                }
                try {
                    DB::beginTransaction();
                    $orgdetails = $user->UploaderOrganization()->wherePivot("status", 1)->first();
                    if ($orgdetails == null) {
                        return response()->json(['message' => "Unauthorized"], 403);
                    }

                    // $datatosave = $request->except(['report_pdf', 'valuation_data']);
                    // $file = $request->file("report_pdf");
                    // $fileName = time() . rand(1, 99) . '.' . $file->extension();
                    // $file->move(public_path('reports'), $fileName);
                    // report object
                    $signatories = $request->signatories;
                    $recipientusernames = $request->recipientUsersnames;
                    $recipientuseremails = $request->recipientUsersemails;
                    $recipientuserphones = $request->recipientUserphones;
                    // $jsonData = json_decode($request->getContent());
                    // return response()->json(['message' => $jsonData['signatories']], 403);
                    // return $signatories;
                    $reporttosave['report_description'] = $request->propertyDescription;
                    $reporttosave['report_uploading_user'] = $user->user_id;
                    $reporttosave['report_uploading_from'] = $orgdetails->id;
                    $reporttosave['market_value'] = $request->marketValue;
                    $reporttosave['forced_market_value'] = $request->forcedSaleValue;
                    $reporttosave['property_lr'] = $request->propertyLR;
                    $reporttosave['valuation_date'] = $request->valuationDate;
                    $reporttosave['approving_director'] = $signatories[0];
                    $reporttosave['encumberrence_details'] = $request->propertyDescription;
                    $reporttosave['receiving_company_id'] = $request->recipientOrg;
                    $reporttosave['receiving_company_read_code'] = "0009";
                    $reporttosave['unique_random_code'] = "0009";

                    // $reporttosave['upload_link'] = $request->;
                    // $reporttosave['download_count'] = $request->;
                    // $reporttosave['views_count'] = $request->;

                    $reporttosave['insurence_value'] = $request->insurenceValue;
                    $reporttosave['location_name_auto'] = $request->e_location_name;
                    $reporttosave['location_name_map'] = $request->a_location_town;
                    $reporttosave['latitude_auto'] = $request->a_location_lat;
                    $reporttosave['longitude_auto'] = $request->a_location_long;
                    $reporttosave['latitude_map'] = $request->a_location_lat;
                    $reporttosave['longitude_map'] = $request->a_location_long;
                    $reporttosave['county'] = $request->e_location_county;
                    $reporttosave['town'] = $request->e_location_town;
                    $reporttosave['street'] = $request->e_location_street;
                    $reporttosave['total_built_up_area'] = $request->totalBultUpArea;
                    $reporttosave['property_type'] = $request->propertyType;
                    $reporttosave['annual_gross_rental_income'] = $request->annualGrossVRevenue;
                    $reporttosave['land_size'] = $request->landSize;
                    $reporttosave['no_of_signatories_to_sign'] = $signatories[0];
                    $reporttosave['no_of_signatories_signed'] = 0;

                    $tenuredetails = 1;
                    $reporttosave['tenure'] = 1;

                    $reporttosave['status'] = 0;
                    $reporttosave['report_uploading_user'] = auth()->user()->id;

                    // report object
                    //    get cached file
                    $recordcached = CachedReport::where(
                        ['user_id' => $user->id,
                            'organization_id' => $orgdetails->id,
                        ])->first();
                    $sourcePath = 'reports_cached/' . $recordcached->file_name;
                    $destinationFolder = 'reports/';
                    $fileName = '';
                    if (Storage::disk('public')->exists($sourcePath)) {
                        $timestamp = time();
                        $fileExtension = pathinfo($sourcePath, PATHINFO_EXTENSION);
                        $fileName = $timestamp . '.' . $fileExtension;
                        $newFilePath = $destinationFolder . $fileName;
                        Storage::disk('public')->copy($sourcePath, $newFilePath);
                    } else {
                        return response()->json([
                            'message' => 'Please reupload the report file again',
                        ], 201);
                    }
                    //get cached file

                    // $datatosave['report_uploading_user'] = $user->id;
                    // $datatosave['valuation_date'] = date('Y-m-d', strtotime($request->valuation_date));
                    $reporttosave['upload_link'] = $fileName;
                    // $datatosave['report_uploading_from'] = $orgdetails->id;
                    // $datatosave['approving_director'] = 0;
                    // $datatosave['receiving_company_read_code'] = 9999;
                    // $datatosave['unique_random_code'] = 999;
                    // $datatosave['receiving_company_id'] = $request->post('receiving_company_id');
                    $lastrow = (ValuationReport::latest()->first()) ? (ValuationReport::latest()->first()) : ['id' => 1];
                    $datatosave['id'] = $lastrow['id'] + 1;
                    $qrcode = $this->generateQRCode($orgdetails, $datatosave);
                    $reporttosave['qr_code'] = $qrcode;
                    $reportd = ValuationReport::create($reporttosave);
                    //append qr code
                    $filePath = Storage::disk("public")->path("reports/" . $fileName);
                    $outputFilePath = Storage::disk("public")->path("reports/" . $fileName . "_signed.pdf");
                    $this->appendQRCODE($filePath, $outputFilePath, $qrcode);
                    //append qr code
                    //generate qr code 3620, 2370, 3520

                    //create users
                    $url = url("/");
                    $upurl = ['url_path' => $url . '/' . $outputFilePath];
                    $index = 0;
                    $reportusersmails = explode(",", $request->recipientUsersemails);
                    $reportusersphones = explode(",", $request->recipientUserphones);
                    $reportusersnames = explode(",", $request->recipientUsersnames);
                    foreach ($reportusersmails as $reportusermail) {
                        //generate code
                        if ($reportusermail != "" && $reportusermail != null) {
                            $accessCode = Str::random(8);
                            $reportuser['name'] = $reportusersnames[$index];
                            $reportuser['phone'] = $reportusersphones[$index];
                            $reportuser['email'] = $reportusermail;
                            $reportuser['access_code'] = $accessCode;
                            $reportuser['valuation_report_id'] = $reportd->id;
                            ReportUser::create($reportuser);
                            Mail::to($reportusermail)->send(new sendReportAccessMail($reportusersnames[$index],
                                $reportusermail, $reportusersphones[$index], $accessCode, array_merge($reportd->toArray(), $upurl), $orgdetails));
                            $index = $index + 1;
                        }

                    }
                    //close create users
                    //reset everything about report

                    //reset everything about report
                    DB::commit();
                    return response()->json([
                        'message' => 'Report send successfully',
                        'report_details' => $reportd,
                    ], 201);

                } catch (Exception $ex) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Failed' . $ex->getMessage(),
                        '',
                    ], 400);
                }

            } else {
                return response()->json(['message' => 'unauthorized access'], 401);
            }
        } else {
            return response()->json(['message' => 'Please login'], 401);
        }
    }

    public function uploadReportV2(Request $request)
    {

        if (auth()->user()) {
            $user = auth()->user();
            if ($user->hasPermissionTo(Permission::where("slug", "upload report")->first())) {
                $validator = Validator::make($request->all(), [
                    'report_description' => 'required|string',
                    'market_value' => 'required|integer',
                    'forced_market_value' => 'required|integer',
                    'property_lr' => 'required|string',
                    'valuation_date' => 'required|string',
                    'receiving_company_id' => 'required|string',
                    'report_pdf' => 'required|mimes:pdf|max:2048',
                ]);
                if ($validator->fails()) {
                    return response()->json(["message" => "Unprocessable data", "backendvalerrors" => $validator->errors()], 422);
                }
                try {
                    DB::beginTransaction();
                    $orgdetails = $user->UploaderOrganization()->wherePivot("status", 1)->first();
                    if ($orgdetails == null) {
                        return response()->json(['message' => "Unauthorized"], 403);
                    }

                    $datatosave['report_uploading_user'] = $user->id;
                    $datatosave['valuation_date'] = date('Y-m-d', strtotime($request->valuation_date));
                    $datatosave['upload_link'] = $fileName;
                    $datatosave['report_uploading_from'] = $orgdetails->id;
                    $datatosave['approving_director'] = 0;
                    $datatosave['receiving_company_read_code'] = 9999;
                    $datatosave['unique_random_code'] = 999;
                    $datatosave['receiving_company_id'] = $request->post('receiving_company_id');
                    $lastrow = (ValuationReport::latest()->first()) ? (ValuationReport::latest()->first()) : ['id' => 1];
                    $datatosave['id'] = $lastrow['id'] + 1;
                    $qrcode = $this->generateQRCode($orgdetails, $datatosave);
                    $datatosave['qr_code'] = $qrcode;
                    $reportd = ValuationReport::create($datatosave);
                    //append qr code
                    $filePath = public_path("reports/" . $fileName);
                    $outputFilePath = public_path("reports/" . $fileName . "_signed.pdf");
                    $this->appendQRCODE($filePath, $outputFilePath, $qrcode);
                    //append qr code
                    //generate qr code

                    // add ReportSignatories
                    $url = url("/");
                    $upurl = ['url_path' => $url . '/' . $outputFilePath];
                    $signatoriesnames = $request->signatory_name;
                    $signatories = $request->signatory;
                    $signatoriesemails = $request->signatory_email;
                    $indexs = 0;
                    foreach ($signatoriesnames as $reportusermail) {
                        //generate code
                        $otp = Str::random(8);
                        $reportsign['user_id'] = $signatories[$indexs];
                        $reportsign['OTP_code'] = $otp;
                        $reportsign['report_id'] = $reportd->id;
                        ReportSignatories::create($reportsign);
                        Mail::to($signatoriesemails[$indexs])->send(new sendReportApprovalMail($signatoriesnames[$indexs],
                            $reportusermail, $signatoriesemails[$indexs], $otp, array_merge($reportd->toArray(), $upurl), $orgdetails));
                        $index = $indexs + 1;

                    }
                    // add ReportSignatories

                    //create users
                    $url = url("/");
                    $upurl = ['url_path' => $url . '/' . $outputFilePath];
                    $index = 0;
                    $reportusersmails = $request->report_users_email;
                    $reportusersphones = $request->report_users_phone;
                    $reportusersnames = $request->report_users_name;
                    foreach ($reportusersmails as $reportusermail) {
                        //generate code
                        $accessCode = Str::random(8);
                        $reportuser['name'] = $reportusersnames[$index];
                        $reportuser['phone'] = $reportusersphones[$index];
                        $reportuser['email'] = $reportusermail;
                        $reportuser['access_code'] = $accessCode;
                        $reportuser['valuation_report_id'] = $reportd->id;
                        ReportUser::create($reportuser);
                        Mail::to($reportusermail)->send(new sendReportAccessMail($reportusersnames[$index],
                            $reportusermail, $reportusersphones[$index], $accessCode, array_merge($reportd->toArray(), $upurl), $orgdetails));
                        $index = $index + 1;

                    }

                    //close create users
                    DB::commit();
                    return response()->json([
                        'message' => 'Report send successfully',
                        'report_details' => $reportd,
                    ], 201);

                } catch (Exception $ex) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Failed' . $ex->getMessage(),
                        '',
                    ], 400);
                }

            } else {
                return response()->json(['message' => 'unauthorized access'], 401);
            }
        } else {
            return response()->json(['message' => 'Please login'], 401);
        }
    }
    public function appendQRCODE($file, $outputFilePath, $qrcode)
    {
        $fpdi = new FPDI;
        $count = $fpdi->setSourceFile($file);
        for ($i = 1; $i <= $count; $i++) {
            $template = $fpdi->importPage($i);
            $size = $fpdi->getTemplateSize($template);
            $fpdi->AddPage($size['orientation'], array($size['width'], $size['height']));
            $fpdi->useTemplate($template);
            $fpdi->SetFont("helvetica", "", 15);
            $fpdi->SetTextColor(153, 0, 153);
            $left = -0;
            $top = 0;
            $fpdi->Image(Storage::disk("public")->path($qrcode), $top, $left, -350);

        }
        $fpdi->Output($outputFilePath, 'F');
    }

    public function generateQRCode($orgdetails, $repoertdetais)
    {

        $image = QrCode::format('png')
            ->size(200)->errorCorrection('H')
            ->generate('A simple example of QR code!');
        $output_file = '/reports/img-' . time() . '.png';
        Storage::disk('public')->put($output_file, $image);

        return $output_file;
        // $writer = new PngWriter();
        // // Create QR code
        // $qrfilelabel = $this->generateValuationCode($repoertdetais['id']);
        // // $qrCode = QrCode::create('Valuation Firm:' . $orgdetails['organization_name'] . '
        // // Property:' . $orgdetails['organization_phone'] . '
        // // ISK NO:' . $orgdetails['organization_phone'] . '
        // // VRB No:' . $orgdetails['organization_phone'] . '
        // // Market Value:' . number_format((float) $repoertdetais['market_value']) . '
        // // Forced Market Value:' . number_format((float) $repoertdetais['forced_market_value']) . '
        // // Valuation Date:' . $repoertdetais['valuation_date'] . '
        // // Valuation Code:' . $qrfilelabel)
        // $qrCode = QrCode::create('Valuation Firm')
        //     ->setEncoding(new Encoding('UTF-8'))
        //     ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
        //     ->setSize(300)
        //     ->setMargin(10)
        //     ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
        //     ->setForegroundColor(new Color(0, 0, 0))
        //     ->setBackgroundColor(new Color(255, 255, 255));
        // //         $logo = Logo::create(public_path('reportqr_codes'),'symfony.png')
        // // ->setResizeToWidth(50);
        // // Create generic label
        // $label = Label::create('ISK Verified')
        //     ->setTextColor(new Color(255, 0, 0));
        // $result = $writer->write($qrCode, null, $label);
        // // Validate the result
        // // $writer->validateResult($result, 'Life is too short to be generating QR codes');
        // $output_file = 'reports/qrc/' . $qrfilelabel . '.png';
        // Storage::disk('public')->put($output_file, $qrCode);

        // $result->saveToFile($result->storeAs('reportqr_codes' . $qrfilelabel . '.png', 'public'));
        // return $qrfilelabel;
    }
    public function generateValuationCode($reportid)
    {
        $today = date('YmdHi');
        $startDate = date('YmdHi', strtotime('-' . $reportid . ' days'));
        $range = $today - $startDate;
        $rand = rand(0, $range);
        return $rand;
    }
    public function updatePersonalInfromation(Request $request)
    {
        $user = auth()->user();
        $role = auth()->user()->roles()->first(["id", "name", "name as role_name"]);
        $id = $user->id;
        $userid = ['user_id' => auth()->user()->id];
        try {
            DB::beginTransaction();
            $userup['full_name'] = $request->full_name;
            $userup['email'] = $request->email;
            $userup['vrb_number'] = $request->vrb_number;
            $userup['isk_number'] = $request->isk_number;
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
            $role = auth()->user()->roles()->first(["id", "name", "name as role_name"]);
            return response()->json([
                'message' => 'Updated successfully.',
                'access_token' => $token,
                'token_type' => 'bearer',
                'user' => array_merge($userupdate->toArray(), $role->toArray(), $userid),
                'role' => $role,
                'user_id' => $user,
                'roles' => $user->roles()->get(["id", "name"]),
                'permissions' => array_merge($user->permissions()->get(["id", "slug as name"])->toArray(), $role->permissions()->get(['id', 'slug as name'])->toArray()),

            ], 201);

        } catch (\Exception $exception) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                'error' => $exception,
                'payload' => $request->all(),
            ], 400);
        }

    }
    public function retriveValuerOrgDetails()
    {
        $user = auth()->user();
        try {
            return response()->json($user->UploaderOrganization()->wherePivot("status", 1)->first()
                , 201);

        } catch (\Exception $exception) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                'error' => $exception,
            ], 400);
        }

    }
    public function updateCompanyInfromation(Request $request)
    {
        $user = auth()->user();
        $role = auth()->user()->roles()->first(["id", "name", "name as role_name"]);
        $id = $user->id;
        $companyinfo = $user->UploaderOrganization()->wherePivot("status", 1)->first();
        $userid = ['user_id' => auth()->user()->id];
        try {
            DB::beginTransaction();
            $compup['organization_name'] = $request->organization_name;
            $compup['organization_phone'] = $request->organization_phone;
            $compup['organization_email'] = $request->organization_email;
            $compup['directors_vrb'] = $request->directors_vrb;
            $compup['isk_number'] = $request->isk_number;
            $compup['idemnity_amount'] = $request->idemnity_amount;
            $compup['idemnity_expiry'] = $request->idemnity_expiry;
            $compupdate = Organization::findOrFail(trim($companyinfo->id));
            $compupdate->fill($compup);
            $compupdate->save();
            DB::commit();
            $user = auth()->user();
            return response()->json([
                'message' => 'Updated successfully.',
            ], 201);

        } catch (\Exception $exception) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                'error' => $exception,
                'payload' => $request->all(),
            ], 400);
        }

    }
    public function sendUserInvite(Request $request)
    {
        $user = auth()->user();
        $role = auth()->user()->roles()->first(["id", "name", "name as role_name"]);
        $companyinfo = $user->UploaderOrganization()->wherePivot("status", 1)->first();
        $userid = ['user_id' => auth()->user()->id];
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:users|unique:valuerfirm_user_invites,invite_email',
                'registration_url' => 'required|url',
                'login_url' => 'required|url',
                'name' => 'required',
                'phone' => 'required',
                'vrb_number' => 'required',
                'isk_number' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(["message" => "Unprocessable data", "errors" => $validator->errors()], 422);
            }
            $user = auth()->user();
            DB::beginTransaction();
            //send mail
            $organization = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            $this->sendUserInviteMail($request->all(), $organization);
            //send mail
            DB::commit();

            return response()->json([
                'message' => 'Updated successfully.',
                'data' => $request->all(),
            ], 201);

        } catch (\Exception $exception) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                'error' => $exception,
                'payload' => $request->all(),
            ], 400);
        }
    }
    public function sendUserInviteMail($request, $org)
    {
        $token = $this->generateAccesorInviteToken($request, $org);
        $user = auth()->user();
        Mail::to($request['email'])->send(new sendValuationFirUserInviteMail($token, $request['registration_url'], $request['login_url'], $user, $request));

    }

    public function generateAccesorInviteToken($request, $org)
    {
        $token = Str::random(80);
        $this->storeAccesorToken($token, $request, $org);
        return $token;
    }

    public function storeAccesorToken($token, $request, $org)
    {
        DB::table('valuerfirm_user_invites')->insert([
            'role_id' => $request['invited_as'],
            'organization_id' => $org->id,
            'invite_email' => $request['email'],
            'personal_phone' => $request['phone'],
            'personal_email' => $request['email'],
            'full_name' => $request['name'],
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'isk_number' => $request['isk_number'],
            'vrb_number' => $request['vrb_number'],
            'created_at' => Carbon::now(),
        ]);
    }
    public function blockUser(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", 'block valuer user')->first())) {

            try {
                DB::beginTransaction();
                //block user
                $userinfo = User::where("id", $request->user)->first();
                $org = $user->UploaderOrganization()->first();
                User::where("id", $request->user)->update(['is_active' => $request->status]);
                $userinfo->UploaderOrganization()->updateExistingPivot($org->id, ['status' => $request->status]);
                //block user
                DB::commit();
                $blocked = ($request->status) ? "Unblocked" : "Blocked";
                return response()->json([
                    'message' => $blocked,
                    'data' => $request->all(),
                ], 201);

            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                    'error' => $exception,
                    'payload' => $request->all(),
                ], 400);

            }

        } else {
            return response()->json(['message' => 'Forbidden access'], 403);
        }
    }
    public function download(Request $request)
    {
        try {
            $myreport = ValuationReport::where("id", $request->report)->first();
            $myFile_unsigned = $filePath = Storage::disk("public")->path("reports/" . $myreport->upload_link);
            $exploded_name = explode(".", $myreport->upload_link);
            $myFile_signed = $filePath = Storage::disk("public")->path("reports/" . $exploded_name[0] . ".pdf_signed.pdf");
            return response()->download($myFile_signed);
        } catch (Exception $exp) {
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }

    }
}
