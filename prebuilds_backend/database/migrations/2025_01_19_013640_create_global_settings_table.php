<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGlobalSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('global_settings', function (Blueprint $table) {
            $table->integer('new_product_duration')->default(1); // 30 days in minutes
        });
    }

    public function down()
    {
        Schema::dropIfExists('global_settings');
    }
}
