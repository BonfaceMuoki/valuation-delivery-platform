<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PropertyType;

class PropertyTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        // const propertytypes = [
        //     { id: 1, name: 'Apartment' },
        //     { id: 2, name: 'House' },
        //     { id: 3, name: 'Townhouse' },
        //     { id: 4, name: 'Commercial Land' },
        //     { id: 5, name: 'Residential Land' },
        //     { id: 6, name: 'Commercial Property' },
        //     { id: 7, name: 'Office' },
        //     { id: 8, name: 'Shop' },
        //     { id: 9, name: 'Warehouse' }
        //     // Additional options...
        //   ];
        $propertytyepes= array("Apartment","House","Townhouse","Commercial Land","Residential Land","Commercial Property","Office","Shop","Warehouse");
        foreach($propertytyepes as $proptype){
          $exist=Propertytype::where("type_name",$proptype)->count();
          if($exist==0){
            PropertyType::create(['type_name'=>$proptype]);
          }
        }
    }
}
