<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Permission;
use App\Models\PropertyType;
use App\Models\ReportConsumer;
use App\Models\User;
use App\Models\ValuationReport;
use App\Models\ValuerfirmUserInvite;
use DB;
use Illuminate\Http\Request;

class CommonController extends Controller
{
    //property_types
    public $search_columns_valuers = [
        ['table' => 'report_consumers', 'columns' => ['organization_name']],
        ['table' => 'valuation_reports', 'columns' => ['property_lr', 'location_name_auto', 'location_name_map', 'county', 'town']],
        ['table' => 'property_types', 'columns' => ['type_name']],
        ['table' => 'users', 'columns' => ['full_name']],
    ];
    public function getAllValuerUserInvites()
    {
        $user = auth()->user();
        if ($user == null) {
            return response()->json(['message' => 'Unautheticated'], 403);
        }
        if ($user->hasPermissionTo(Permission::where("slug", 'view all Users')->first())) {
            $query = ValuerfirmUserInvite::query();
            $users = $query->get();
            return response($users, 200);
        } else if ($user->hasPermissionTo(Permission::where("slug", 'view valuation firm users only')->first())) {
            $org = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            $orgid = $org->id;
            $query = ValuerfirmUserInvite::query();
            $users = $query->get();
            return response($users, 200);
        } else if ($user->hasPermissionTo(Permission::where("slug", 'view accesors users only')->first())) {
            $org = $user->AccessorOrganization()->wherePivot("status", 1)->first();
            $orgid = $org->id;
            $query = AccesorUserInvite::query();
            $users = $query->get();
            return response($users, 200);

        } else {
            $query = ValuerfirmUserInvite::query();
            $users = $query->paginate($request->rowsPerPage);
            return response($users, 200);
        }

    }
    public function getAccesorsList(Request $request)
    {
        $all = ReportConsumer::paginate(($request->no_records)?$request->no_records:10);
        return response()->json($all, 201);
    }
    public function getAllCounties()
    {
        $all = DB::table('county')->get();
        return response()->json($all, 201);
    }
    public function getAllUsers(Request $request)
    {

        $user = auth()->user();
        if ($user == null) {
            return response()->json(['message' => 'Unautheticated'], 403);
        }
        if ($user->hasPermissionTo(Permission::where("slug", 'view all Users')->first())) {
            $query = User::query();

            $users = $query->paginate($request->rowsPerPage);

            return response($users, 200);

        } else if ($user->hasPermissionTo(Permission::where("slug", 'view valuation firm users only')->first())) {

            $org = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            $orgid = $org->id;

            $query = User::query();
            $query->with("UploaderOrganization")
                ->with("roles")
                ->whereHas("UploaderOrganization", function ($query) use ($orgid) {
                    $query->where("organization_id", $orgid);
                });
            $users = $query->paginate($request->rowsPerPage);

            return response($users, 200);

        } else if ($user->hasPermissionTo(Permission::where("slug", 'view accesors users only')->first())) {
            $org = $user->AccessorOrganization()->wherePivot("status", 1)->first();
            $orgid = $org->id;
            $query = User::query();
            $query->with("AccessorOrganization")
                ->with("roles")
                ->whereHas("AccessorOrganization", function ($query) use ($orgid) {
                    $query->where("report_consumer_id", $orgid);
                });
            $users = $query->paginate($request->rowsPerPage);
            return response($users, 200);

        } else {

            $query = User::query();

            $users = $query->paginate($request->rowsPerPage);

            return response($users, 200);
        }

    }
    public function getAccesorsUsersList($accesor)
    {
        $org = ReportConsumer::where("id", $accesor)->first();
        if ($org) {
            return response()->json($org->users()->get(), 201);

        } else {
            return response()->json(['code' => 0, 'users_list' => null, 'message' => 'Organization is not found'], 201);
        }
    }
    public function getUploadersList()
    {
        $all = Organization::paginate(10);
        return response()->json($all, 201);
    }
    public function getUploadersUsersList($uploader)
    {
        $org = Organization::where("id", $uploader)->first();
        if ($org) {
            return response()->json($org->users()->get(), 201);

        } else {
            return response()->json(['code' => 0, 'users_list' => null, 'message' => 'Organization is not found'], 201);
        }
    }
    public function getReportsList(Request $request)
    {

        $user = auth()->user();
        // return response()->json(['code' => 0, 'org' =>$user->UploaderOrganization()->first(), 'message' => 'Organization is not found'], 201);

        if ($user == null) {
            return response()->json(['message' => 'Unautheticated'], 403);
        }
        $reports_query = ValuationReport::query();
        $reports_query->join("property_types", "property_types.id", "=", "valuation_reports.property_type");
      
        $reports = array();
        $url = url("/");
        if ($user->hasPermissionTo(Permission::where("slug", 'view valuation firm reports only')->first())) {
            $reports_query->join("users", "users.id", "=", "valuation_reports.report_uploading_user");
            $org = $user->UploaderOrganization()->wherePivot("status", 1)->first();
            if ($org == null) {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }
            $reports_query->join("report_consumers", "report_consumers.id", "=", "valuation_reports.receiving_company_id");
            $reports_query->where("report_uploading_from", $org->id);
            if ($request->filled('search')) {
                $keyword = $request->search;
                $searchcols = $this->search_columns_valuers;
                $reports_query->where(function ($reports_query) use ($keyword, $searchcols) {

                    foreach ($searchcols as $searchcol) {
                        $table = $searchcol['table'];
                        $tablecolumns = $searchcol['columns'];
                        foreach ($tablecolumns as $tablecolumn) {
                            $reports_query->orWhere('' . $table . '.' . $tablecolumn . '', 'like', "%$keyword%");
                        }
                    }
                });
            }
            $reports_query->select("valuation_reports.*", "report_consumers.organization_name", DB::raw("CONCAT('" . $url . "','/reports/',valuation_reports.upload_link) as report_url"));
            $reports = $reports_query->paginate($request->no_records);
        } else if ($user->hasPermissionTo((Permission::where("slug", 'view accesors reports only')->first()))) {            
            // echo "hallo";
            $org = $user->AccessorOrganization()->wherePivot("status", 1)->first();
            if ($org == null) {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }
            $reports_query->join("report_consumers", "report_consumers.id", "=", "valuation_reports.receiving_company_id");
            $reports_query->where("receiving_company_id", $org->id);
            $reports_query->select('valuation_reports.*', 'report_consumers.organization_name');
            // $reports_query->select("valuation_reports.*", "organizations.organization_name",DB::raw("CONCAT('".$url."','/reports/',valuation_reports.upload_link) as report_url"));

            $reports = $reports_query->paginate($request->no_records);
        } else if ($user->hasPermissionTo((Permission::where("slug", 'view all reports')->first()))) {

            $reports_query->join("report_consumers", "report_consumers.id", "=", "valuation_reports.receiving_company_id");
            $reports_query->join("organizations", "organizations.id", "=", "valuation_reports.report_uploading_from");
            $reports_query->select("valuation_reports.*", "organizations.organization_name as valuation_firm_name", "report_consumers.organization_name", DB::raw("CONCAT('" . $url . "','/reports/',valuation_reports.upload_link) as report_url"));
            $reports = $reports_query->paginate($request->no_records);
        } else {
            $reports_query->join("report_consumers", "report_consumers.id", "=", "valuation_reports.receiving_company_id");
            $reports_query->join("organizations", "organizations.id", "=", "valuation_reports.report_uploading_from");
            $reports_query->select("valuation_reports.*", "organizations.organization_name as valuation_firm_name", "report_consumers.organization_name", DB::raw("CONCAT('" . $url . "','/reports/',valuation_reports.upload_link) as report_url"));
            $reports = $reports_query->paginate($request->no_records);
            return response()->json(['message' => 'You do not have the permission to view this resource'], 401);
        }

        // $formattedreports = array_map(function ($item) {
        //     $item['forced_market_value'] = number_format($item['forced_market_value'], 2, '.', ',');
        //     $item['market_value'] = number_format($item['market_value'], 2, '.', ',');
        //     return $item;
        // }, $reports->data->toArray());

        return response()->json($reports);
    }
    public function downloadValuationReport($id, $signed = 0)
    {

        $foundfile = ValuationReport::where("id", $id)->first();

        if (file_exists(public_path('/reports/') . $foundfile['upload_link'])) {
            $headers = [
                'Content-Type' => 'application/pdf',
            ];
            $pdffile = "";
            $exploded = explode(".", $foundfile['upload_link']);
            if ($signed == 1) {
                if (file_exists(public_path('/reports/') . $exploded[0] . ".pdf_signed.pdf")) {
                    $pdffile = public_path('/reports/') . $exploded[0] . ".pdf_signed.pdf";
                    return response()->download($pdffile, 'Test File', $headers, 'inline');
                } else {
                    abort(404, 'File not found!');
                }

            }
            $pdffile = public_path('/reports/') . $foundfile['upload_link'];
            return response()->download($pdffile, $foundfile['upload_link'], $headers, 'inline');
        } else {
            abort(404, 'File not found!');
        }
    }
    public function getAllProprtyTypes()
    {
        $all = PropertyType::all();
        return response()->json($all, 201);
    }

}
