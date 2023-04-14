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
        Schema::create('report_consumers', function (Blueprint $table) {
            $table->id();
            $table->string("organization_name");
            $table->string("organization_phone");
            $table->string("organization_email")->nullable();
            $table->string("organization_logo")->nullable();
            $table->string("organization_type")->nullable();
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
        Schema::dropIfExists('report_consumers');
    }
};
