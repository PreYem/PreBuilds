<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');  // Primary key, auto-incremented
            $table->string('product_name', 255)->nullable();  // Product name
            $table->integer('category_id')->index();  // Foreign key to category (indexed)

            $table->text('product_desc')->nullable();  // Product description

            $table->decimal('buying_price', 10, 2)->default(0.00);  // Buying price
            $table->decimal('selling_price', 10, 2)->default(0.00);  // Selling price
            $table->integer('product_quantity')->default(0);  // Product quantity
            $table->enum('product_visibility', ['Visible', 'Invisible'])->default('Visible');  // Visibility of product
            $table->timestamp('date_created')->useCurrent();  // Timestamp for when the product was created
            $table->string('product_picture', 255)->default('images/default_product_picture.jpg'); 
            $table->decimal('discount_price', 10, 2)->default(0.00);  // Discount price

            // Adding foreign key relationship
            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

