<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
    {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
        {
        //
        $roles = ['Super Admin', 'Receivers Admin', 'Accesser Admin','Report Uploader','Report Uploader Admin', 'Report Accesser','Uploaders Accesser'];
        foreach ($roles as $role) {
            Role::create([
                'name' => $role,
                'slug' => strtolower($role)
            ]);
            }

        }
    }