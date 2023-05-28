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
        Schema::create('valuation_firm_invites', function (Blueprint $table) {
            $table->id();
            $table->text("invite_token");
            $table->text("registration_url")->nullable();
            $table->string("login_url")->nullable();
            $table->boolean("completed")->default(false);
            $table->string('invite_email');
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
        Schema::dropIfExists('valuation_firm_invites');
    }
};
