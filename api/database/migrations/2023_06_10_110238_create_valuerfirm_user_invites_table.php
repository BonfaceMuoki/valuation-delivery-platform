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
        Schema::create('valuerfirm_user_invites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("organization_id");
            $table->string("invite_email");
            $table->string("full_name");
            $table->string("invite_token");
            $table->string("personal_phone")->nullable();
            $table->string("personal_email")->nullable();
            $table->string("isk_number")->nullable();
            $table->string("vrb_number")->nullable();
            $table->string("invite_instruction");
            $table->integer("status")->default(0);
            $table->unsignedBigInteger("role_id");
            $table->timestamps();


            $table->foreign("role_id")->references("id")->on("roles")->onDelete("cascade");
            $table->foreign("organization_id")->references("id")->on("organizations")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('valuerfirm_user_invites');
    }
};
