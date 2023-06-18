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
        Schema::create('archive_valuer_access_requests', function (Blueprint $table) {
            $table->id();
            $table->string('invite_email');
            $table->string('invite_phone');
            $table->string('valauaion_firm_name');
            $table->string('vrb_number');
            $table->string('isk_number');           
            $table->string('director_name');
            $table->enum('status',['Requested','Approved','Rejected','Registered'])->default('Requested');   
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
        Schema::dropIfExists('archive_valuer_access_requests');
    }
};
