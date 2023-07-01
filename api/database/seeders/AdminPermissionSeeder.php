<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use DB;
class AdminPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $superadmin_role = Role::where('slug', 'super admin')->first();
        $admin_permissions = array(
            array('role_id' => '1','permission_id' => '2','id' => '2','name' => 'Add Uploader','slug' => 'add uploader','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '4','id' => '4','name' => 'view accesors reports only','slug' => 'view accesors reports only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '5','id' => '5','name' => 'view all reports','slug' => 'view all reports','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '7','id' => '7','name' => 'View Super Admin Dashbaord','slug' => 'view super admin dashbaord','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '8','id' => '8','name' => 'Register Valuation Firm','slug' => 'register valuation firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '9','id' => '9','name' => 'Register Report Accessor','slug' => 'register report accessor','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '10','id' => '10','name' => 'Delete Valuation Firm','slug' => 'delete valuation firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '11','id' => '11','name' => 'Delete Accesor','slug' => 'delete accesor','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '12','id' => '12','name' => 'Delete Report','slug' => 'delete report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '13','id' => '13','name' => 'View Accesors Dashboard','slug' => 'view accesors dashboard','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '14','id' => '14','name' => 'Search Report','slug' => 'search report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '15','id' => '15','name' => 'Register Valuation Step','slug' => 'register valuation step','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '16','id' => '16','name' => 'Edit Valuation Step','slug' => 'edit valuation step','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '17','id' => '17','name' => 'Delete Valuation Step','slug' => 'delete valuation step','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '18','id' => '18','name' => 'Approve User','slug' => 'approve user','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '19','id' => '19','name' => 'Delete User','slug' => 'delete user','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '20','id' => '20','name' => 'Block Valuer User','slug' => 'block valuer user','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '21','id' => '21','name' => 'Invite Uploader','slug' => 'invite uploader','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '22','id' => '22','name' => 'Invite Accessor','slug' => 'invite accessor','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '23','id' => '23','name' => 'Invite Valuation Firm','slug' => 'invite valuation firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '24','id' => '24','name' => 'Invite Accessor Firm','slug' => 'invite accessor firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '25','id' => '25','name' => 'Add Role','slug' => 'add role','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '26','id' => '26','name' => 'Add Permission','slug' => 'add permission','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '27','id' => '27','name' => 'Assign Role Permission','slug' => 'assign role permission','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '28','id' => '28','name' => 'View Permissions','slug' => 'view permissions','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '29','id' => '29','name' => 'View Roles ','slug' => 'view roles ','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '30','id' => '30','name' => 'View Role Permissions ','slug' => 'view role permissions ','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '31','id' => '31','name' => 'View Valuation Firms','slug' => 'view valuation firms','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '32','id' => '32','name' => 'View Accesors','slug' => 'view accesors','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '33','id' => '33','name' => 'View All Users','slug' => 'view all users','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '36','id' => '36','name' => 'Download Report','slug' => 'download report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '37','id' => '37','name' => 'View Uploader Profile','slug' => 'view uploader profile','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '38','id' => '38','name' => 'View Accesor Profile','slug' => 'view accesor profile','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '40','id' => '40','name' => 'View Valuation Firm Roles','slug' => 'view valuation firm roles','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '1','permission_id' => '41','id' => '41','name' => 'View Accesor Firm Roles','slug' => 'view accesor firm roles','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37')
          );
          foreach ($admin_permissions as $permission) {
            $perm = Permission::where("name", $permission['name'])->first();
            $axist=DB::table("roles_permissions")->where("permission_id",$perm->id)->where("role_id",$superadmin_role->id)->get();
            if(sizeof($axist)==0){
                
                $valuationadmin_role->permissions()->attach($perm);
             }
            
        }
    }
}
