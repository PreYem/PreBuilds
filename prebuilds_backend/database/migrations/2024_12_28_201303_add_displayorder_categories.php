<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Add the column first without a default value
        Schema::table('categories', function (Blueprint $table) {
            $table->integer('category_display_order')->nullable();
        });

        // Populate the column with default values (row count + 1)
        DB::statement('
            UPDATE categories
            SET category_display_order = (SELECT COUNT(*) FROM categories c WHERE c.id <= categories.id)
        ');

        // Make the column non-nullable after setting values
        Schema::table('categories', function (Blueprint $table) {
            $table->integer('category_display_order')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('category_display_order');
        });
    }
};
