<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Permission;
use DB;

class AdminController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware("Admin");

    }
    public function addRoles(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add role")->first())) {
            try {
                DB::beginTransaction();
                $roles = json_decode(stripslashes($request->post('role_name')), true);
                foreach ($roles as $role) {
                    $role['name'] = $role['role_name'];
                    $role['slug'] = strtolower($role['role_name']);
                    $role['status'] = 1;
                    Role::create($role);
                }
                DB::commit();
                return response()->json([
                    'message' => 'Added successfully'
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exception
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function addPermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "add permission")->first())) {
            try {
                DB::beginTransaction();
                $permissions = json_decode(stripslashes($request->post('permission_name')), true);
                foreach ($permissions as $perm) {
                    //check if exists
                    $found = Permission::where("name", $perm['permission_name'])->get();
                    if (sizeof($found) == 0) {
                        $permission['name'] = $perm['permission_name'];
                        $permission['slug'] = strtolower($perm['permission_name']);
                        $permission['status'] = 1;
                        Permission::create($permission);
                    }
                    //check if exists

                }
                DB::commit();
                return response()->json([
                    'message' => 'Added successfully'
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exception->getMessage()
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function attachPermissionsToRole(Request $request)
    {

    }
    public function deactivateUserAccount()
    {

    }
    public function deactivateValuationFirm()
    {

    }
    public function deactivateReportConsumer()
    {

    }
    public function getAllPermissions()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "assign role permission")->first())) {
            return response()->json(['permissions' => Permission::all()], 201);
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function getAllRoles()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "view roles")->first())) {
            return response()->json(['roles' => Role::all()], 201);
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }
    public function assignRolePermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where("slug", "assign role permission")->first())) {
            try {
                DB::beginTransaction();
                $data = $request->post('permissions');
                //  get role details
                $role = Role::where("id", $request->post('role'))->first();
                $permissions = $request->post("permissions");
                foreach ($permissions as $permission) {
                    $perm = Permission::where("id", $permission)->first();
                    $role->permissions()->attach($perm);
                }
                DB::commit();
                return response()->json([
                    'message' => 'Assigned successfully',
                    'permissions' => $role->permissions()->get()
                ], 201);
                //  get role details
            } catch (\Exception $exp) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exp->getMessage()
                ], 400);
            }

        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }

    }
    public function getRolePermissions(Request $request)
    {
        $role = Role::where("id", $request->get('role'))->first();
        return response()->json([
            'role' => $role,
            'permissions' => $role->permissions()->get()
        ], 400);
    }

}