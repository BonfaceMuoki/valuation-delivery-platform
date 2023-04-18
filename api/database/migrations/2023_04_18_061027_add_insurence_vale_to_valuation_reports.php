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
        Schema::table('valuation_reports', function (Bluepri1nt $table) {
            //
            $table->double("insurence_value")->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('valuation_reports', function (Blueprint $table) {
            //
            $table->dropColumn("insurence_value");
        });
    }
};
