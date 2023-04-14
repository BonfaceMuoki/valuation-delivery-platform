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
        $roles = ['Admin','Valuation Firm Direcotr','Report Accessor','Report uploader','Valuation Firm Admin','Receiver Admin','Report Uploader Admin'];
        foreach ($roles as $role) {
            Role::create([
                'name' => $role,
                'slug' => strtolower($role)
            ]);
            }

        }
    }