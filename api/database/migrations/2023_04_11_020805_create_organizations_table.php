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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string("organization_name");
            $table->string("organization_phone");
            $table->string("organization_email");
            $table->string("directors_vrb")->nullable();
            $table->string("isk_number")->nullable();
            $table->string("organization_logo")->nullable();
            $table->string("idemnity_amount")->nullable();
            $table->string("idemnity_expiry")->nullable();
            $table->string("created_by");
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
        Schema::dropIfExists('organizations');
    }
};
