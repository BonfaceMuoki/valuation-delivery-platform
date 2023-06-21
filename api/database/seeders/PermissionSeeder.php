<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $permissions = array(
            array('id' => '3','name' => 'Upload Report','slug' => 'upload report','status' => '1','created_at' => '2023-04-17 12:43:53','updated_at' => '2023-04-17 12:43:53'),
            array('id' => '4','name' => 'Add Uploader','slug' => 'add uploader','status' => '1','created_at' => '2023-04-17 12:43:53','updated_at' => '2023-04-17 12:43:53'),
            array('id' => '5','name' => 'view valuation firm reports only','slug' => 'view valuation firm reports only','status' => '1','created_at' => '2023-04-21 13:17:54','updated_at' => '2023-04-21 13:17:54'),
            array('id' => '6','name' => 'view accesors reports only','slug' => 'view accesors reports only','status' => '1','created_at' => '2023-04-21 13:17:54','updated_at' => '2023-04-21 13:17:54'),
            array('id' => '7','name' => 'view all reports','slug' => 'view all reports','status' => '1','created_at' => '2023-04-21 13:17:54','updated_at' => '2023-04-21 13:17:54'),
            array('id' => '13','name' => 'View Valuation Firm Dashboard','slug' => 'view valuation firm dashboard','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '14','name' => 'View Super Admin Dashbaord','slug' => 'view super admin dashbaord','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '15','name' => 'Register Valuation Firm','slug' => 'register valuation firm','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '16','name' => 'Register Report Accessor','slug' => 'register report accessor','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '17','name' => 'Delete Valuation Firm','slug' => 'delete valuation firm','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '18','name' => 'Delete Accesor','slug' => 'delete accesor','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '19','name' => 'Delete Report','slug' => 'delete report','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '20','name' => 'View Accesors Dashboard','slug' => 'view accesors dashboard','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '21','name' => 'Search Report','slug' => 'search report','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '22','name' => 'Register Valuation Step','slug' => 'register valuation step','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '23','name' => 'Edit Valuation Step','slug' => 'edit valuation step','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '24','name' => 'Delete Valuation Step','slug' => 'delete valuation step','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '25','name' => 'Approve User','slug' => 'approve user','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '26','name' => 'Delete User','slug' => 'delete user','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '27','name' => 'Block Valuer User','slug' => 'block valuer user','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '28','name' => 'Invite Uploader','slug' => 'invite uploader','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '29','name' => 'Invite Accessor','slug' => 'invite accessor','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '30','name' => 'Invite Valuation Firm','slug' => 'invite valuation firm','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '31','name' => 'Invite Accessor Firm','slug' => 'invite accessor firm','status' => '1','created_at' => '2023-05-12 15:12:29','updated_at' => '2023-05-12 15:12:29'),
            array('id' => '32','name' => 'Add Role','slug' => 'add role','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '33','name' => 'Add Permission','slug' => 'add permission','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '34','name' => 'Assign Role Permission','slug' => 'assign role permission','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '35','name' => 'View Permissions','slug' => 'view permissions','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '36','name' => 'View Roles ','slug' => 'view roles ','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '37','name' => 'View Role Permissions ','slug' => 'view role permissions ','status' => '1','created_at' => '2023-05-12 15:41:09','updated_at' => '2023-05-12 15:41:09'),
            array('id' => '38','name' => 'View Valuation Firms','slug' => 'view valuation firms','status' => '1','created_at' => '2023-05-13 15:56:04','updated_at' => '2023-05-13 15:56:04'),
            array('id' => '39','name' => 'View Accesors','slug' => 'view accesors','status' => '1','created_at' => '2023-05-13 15:56:04','updated_at' => '2023-05-13 15:56:04'),
            array('id' => '40','name' => 'View All Users','slug' => 'view all Users','status' => '1','created_at' => NULL,'updated_at' => NULL),
            array('id' => '42','name' => 'View Accesors Users Only','slug' => 'view accesors users only','status' => '1','created_at' => '2023-06-07 14:14:09','updated_at' => '2023-06-07 14:14:09'),
            array('id' => '43','name' => 'View Accesors Uploaders Only','slug' => 'view accesors uploaders only','status' => '1','created_at' => '2023-06-07 14:16:04','updated_at' => '2023-06-07 14:16:04'),
            array('id' => '44','name' => 'Download Report','slug' => 'download report','status' => '1','created_at' => '2023-06-07 14:16:59','updated_at' => '2023-06-07 14:16:59'),
            array('id' => '45','name' => 'View Uploader Profile','slug' => 'view uploader profile','status' => '1','created_at' => '2023-06-07 16:52:34','updated_at' => '2023-06-07 16:52:34'),
            array('id' => '46','name' => 'View Accesor Profile','slug' => 'view accesor profile','status' => '1','created_at' => '2023-06-07 16:52:45','updated_at' => '2023-06-07 16:52:45'),
            array('id' => '47','name' => 'View Valuation Firm Users Only','slug' => 'view valuation firm users only','status' => '1','created_at' => '2023-06-10 06:41:27','updated_at' => '2023-06-10 06:41:27'),
            array('id' => '48','name' => 'View Valuation Firm Roles','slug' => 'view valuation firm roles','status' => '1','created_at' => '2023-06-11 13:37:13','updated_at' => '2023-06-11 13:37:13'),
            array('id' => '49','name' => 'View Accesor Firm Roles','slug' => 'view accesor firm roles','status' => '1','created_at' => '2023-06-15 12:14:00','updated_at' => '2023-06-15 12:14:00')
          );
          //admin 
         $role=Role::where('slug','super admin')->first();
          //admin role
        foreach ($permissions as $permission) {

            $createdpermission=Permission::create([
                'name' => $permission['name'],
                'slug' => strtolower( $permission['name'])
            ]);
            $role->permissions()->attach($createdpermission);
            
        }
            //assign admin all permissions
            //assign admin all permissions

        
    }
}
