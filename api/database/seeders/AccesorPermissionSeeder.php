<?php

namespace Database\Seeders;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;

class AccesorPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $accesoradmin_role = Role::where('slug', 'report accessor admin')->first();
        $accesor_admin_permissions = array(
            array('role_id' => '5','permission_id' => '4','id' => '4','name' => 'view accesors reports only','slug' => 'view accesors reports only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '13','id' => '13','name' => 'View Accesors Dashboard','slug' => 'view accesors dashboard','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '14','id' => '14','name' => 'Search Report','slug' => 'search report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '22','id' => '22','name' => 'Invite Accessor','slug' => 'invite accessor','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '24','id' => '24','name' => 'Invite Accessor Firm','slug' => 'invite accessor firm','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '34','id' => '34','name' => 'View Accesors Users Only','slug' => 'view accesors users only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '35','id' => '35','name' => 'View Accesors Uploaders Only','slug' => 'view accesors uploaders only','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '36','id' => '36','name' => 'Download Report','slug' => 'download report','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '38','id' => '38','name' => 'View Accesor Profile','slug' => 'view accesor profile','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37'),
            array('role_id' => '5','permission_id' => '41','id' => '41','name' => 'View Accesor Firm Roles','slug' => 'view accesor firm roles','status' => '1','created_at' => '2023-07-01 06:35:37','updated_at' => '2023-07-01 06:35:37')
          );

          foreach ($accesor_admin_permissions as $permission) {
            $perm = Permission::where("name", $permission['name'])->first();
            $axist=DB::table("roles_permissions")->where("permission_id",$perm->id)->where("role_id",$accesoradmin_role['id'])->get();
            if(sizeof($axist)==0){
                
                $accesoradmin_role->permissions()->attach($perm);
             }
            
        }



    }
}
