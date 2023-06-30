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
        Schema::create('valuation_reports', function (Blueprint $table) {
            $table->id();
            $table->string("report_description")->nullable();            
            $table->unsignedBigInteger("report_uploading_user");
            $table->unsignedBigInteger("report_uploading_from");
            $table->double("market_value")->nullable();
            $table->double("forced_market_value")->nullable();
            $table->string("property_lr");
            $table->date("valuation_date")->nullable();
            $table->unsignedBigInteger("approving_director");
            $table->text("encumberrence_details")->nullable();
            $table->string("qr_code");
            $table->unsignedBigInteger("receiving_company_id");
            $table->string("receiving_company_read_code");
            $table->string("unique_random_code");
            $table->string("upload_link");
            $table->integer("download_count")->default(0);
            $table->integer("views_count")->default(0);
            $table->integer("insurence_value")->default(0);
// add columns
           $table->string("location_name")->nullable();
           $table->string("county")->nullable();
           $table->string("town")->nullable();
           $table->string("street")->nullable();
           $table->string("total_built_up_area")->nullable();
           $table->string("property_type")->nullable();
           $table->string("annual_gross_rental_income")->nullable();
           $table->string("land_size")->nullable();
           $table->integer("no_of_signatories_to_sign")->default(0);
           $table->integer("no_of_signatories_signed")->default(0);
           $table->enum("tenure",['LeaseHold','FreeHold'])->default('FreeHold');
// add columns
            $table->enum("status",['Waiting Signatures','Partially Signed','Submitted'])->default('submitted');
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
        Schema::dropIfExists('valuation_reports');
    }
};
