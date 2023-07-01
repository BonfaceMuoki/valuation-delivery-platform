<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Role;
use App\Models\Permission;
use DB;


class ValuationPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $valuationadmin_role = Role::where('slug', 'report uploader admin')->first();
        $uploader_admin_permissions = array(
            array('role_id' => '6','permission_id' => '1','id' => '1','name' => 'Upload Report','slug' => 'upload report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '3','id' => '3','name' => 'view valuation firm reports only','slug' => 'view valuation firm reports only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '4','id' => '4','name' => 'view accesors reports only','slug' => 'view accesors reports only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '6','id' => '6','name' => 'View Valuation Firm Dashboard','slug' => 'view valuation firm dashboard','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '13','id' => '13','name' => 'View Accesors Dashboard','slug' => 'view accesors dashboard','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '14','id' => '14','name' => 'Search Report','slug' => 'search report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '18','id' => '18','name' => 'Approve User','slug' => 'approve user','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '22','id' => '22','name' => 'Invite Accessor','slug' => 'invite accessor','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '24','id' => '24','name' => 'Invite Accessor Firm','slug' => 'invite accessor firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '34','id' => '34','name' => 'View Accesors Users Only','slug' => 'view accesors users only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '35','id' => '35','name' => 'View Accesors Uploaders Only','slug' => 'view accesors uploaders only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '36','id' => '36','name' => 'Download Report','slug' => 'download report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '37','id' => '37','name' => 'View Uploader Profile','slug' => 'view uploader profile','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '38','id' => '38','name' => 'View Accesor Profile','slug' => 'view accesor profile','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '39','id' => '39','name' => 'View Valuation Firm Users Only','slug' => 'view valuation firm users only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '40','id' => '40','name' => 'View Valuation Firm Roles','slug' => 'view valuation firm roles','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '6','permission_id' => '41','id' => '41','name' => 'View Accesor Firm Roles','slug' => 'view accesor firm roles','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37')
          );
          foreach ($uploader_admin_permissions as $permission) {
            $perm = Permission::where("name", $permission['name'])->first();
            $axist=DB::table("roles_permissions")->where("permission_id",$perm->id)->where("role_id",$valuationadmin_role['id'])->get();
            if(sizeof($axist)==0){
                
                $valuationadmin_role->permissions()->attach($perm);
             }
            
        }

    }
}
