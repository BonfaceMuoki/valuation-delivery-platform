<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('valuation_firm_registration_requests', function (Blueprint $table) {
            $table->id();
            $table->string('invite_email');
            $table->string('invite_phone');
            $table->string('valauaion_firm_name');
            $table->string('vrb_number');
            $table->string('isk_number');           
            $table->string('director_name');   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('valuation_firm_registration_requests');
    }
};
