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
        Schema::create('accesor_invites', function (Blueprint $table) {
            $table->id();
            $table->text("invite_token");
            $table->text("registration_url")->nullable();
            $table->string("login_url")->nullable();
            $table->boolean("completed")->default(false);
            $table->string('invite_email');
            $table->string('accessor_name');
            $table->string('contact_person_name');
            $table->string('contact_person_phone');
            $table->string('type')->default("Court");  
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
        Schema::dropIfExists('accesor_invites');
    }
};
