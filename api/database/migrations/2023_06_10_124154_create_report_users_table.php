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
        Schema::create('report_users', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("phone")->nullable();
            $table->string("email")->nullable();
            $table->string("access_code");
            $table->unsignedBigInteger("valuation_report_id");
            $table->integer("no_accessed")->default(0);
            $table->timestamps();
            $table->foreign("valuation_report_id")->references("id")->on("valuation_reports")->onDelete("cascade");

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_users');
    }
};
