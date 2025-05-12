<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('global_settings', function (Blueprint $table) {
                                                 // Add new key-value structure
            $table->string('key')->nullable();   // The setting name (e.g. 'new_product_duration')
            $table->string('value')->nullable(); // The setting value (e.g. '1440')
            $table->integer('new_product_duration')->nullable()->change();
        });

        // Optionally, if you have other settings like `max_active_orders_per_user`, you can add those here as well:
        // GlobalSetting::create(['key' => 'max_active_orders_per_user', 'value' => '3']);
    }

    public function down()
    {
        Schema::table('global_settings', function (Blueprint $table) {
            // Drop the new columns if rolling back migration
            $table->dropColumn(['key', 'value']);
        });
    }

};
