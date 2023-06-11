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
        Schema::create('accesor_user_invites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("report_consumer_id");
            $table->string("invite_email");
            $table->string("full_name");
            $table->string("invite_token");
            $table->string("personal_phone")->nullable();
            $table->string("personal_email")->nullable();
            $table->string("invite_instruction")->nullable();;
            $table->integer("status")->default(0);
            $table->unsignedBigInteger("role_id");

            $table->string("registration_url");
            $table->string("login_url");

            
            $table->timestamps();
            $table->foreign("role_id")->references("id")->on("roles")->onDelete("cascade");
            $table->foreign("report_consumer_id")->references("id")->on("report_consumers")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('accesor_user_invites');
    }
};
