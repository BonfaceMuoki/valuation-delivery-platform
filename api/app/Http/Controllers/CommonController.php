<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\ReportConsumer;
use App\Models\ValuationReport;
use Illuminate\Http\Request;
use App\Models\Permission;

class CommonController extends Controller
{
    //
    public function getAccesorsList()
    {
        $all = ReportConsumer::asll();
        return response()->json(['code' => 1, 'accesors' => $all], 201);
    }
    public function getAccesorsUsersList($accesor)
    {
        $org = ReportConsumer::where("id", $accesor)->first();
        if ($org) {
            return response()->json(['code' => 1, 'users_list' => $org->users()->get()], 201);

        } else {
            return response()->json(['code' => 0, 'users_list' => null, 'message' => 'Organization is not found'], 201);
        }
    }
    public function getUploadersList()
    {
        $all = Organization::all();
        return response()->json(['code' => 1, 'accesors' => $all], 201);
    }
    public function getUploadersUsersList($uploader)
    {
        $org = Organization::where("id", $uploader)->first();
        if ($org) {
            return response()->json(['code' => 1, 'users_list' => $org->users()->get()], 201);

        } else {
            return response()->json(['code' => 0, 'users_list' => null, 'message' => 'Organization is not found'], 201);
        }
    }
    public function getReportsList()
    {
        $user = auth()->user();
        $reports_query = ValuationReport::query();
        $reports = array();
        if ($user->hasPermissionTo(Permission::where("name", 'view valuation firm reports only')->first())) {
            $org = $user->UploaderOrganization()->first();
            $reports_query->join("report_consumers", "report_consumers.id", "=", "valuation_reports.receiving_company_id");
            $reports_query->where("report_uploading_from", $org->id);
            $reports_query->select('valuation_reports.*', 'report_consumers.organization_name');
            $reports = $reports_query->get();
        } else if ($user->hasPermissionTo((Permission::where("name", 'view accesors reports only')->first()))) {
            $org = $user->AccessorOrganization()->first();
            $reports_query->join("organizations", "organizations.id", "=", "valuation_reports.report_uploading_from");
            $reports_query->where("report_uploading_from", $org->id);
            $reports_query->select('valuation_reports.*', 'organizations.organization_name');
            $reports = $reports_query->get();
        } else if ($user->hasPermissionTo((Permission::where("name", 'view all reports')->first()))) {
            $reports = $reports_query->get();
        } else {
            return response()->json(['message' => 'You do not have the permission to view this resource'], 401);
        }
        return response()->json($reports);
    }
    
}