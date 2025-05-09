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
       Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->timestamp('order_date')->useCurrent();
            $table->decimal('order_totalAmount', 10, 2);
            $table->string('order_shippingAddress');
            $table->string('order_status')->default('Pending confirmation');
            $table->string('order_paymentMethod');
            $table->string('order_phoneNumber');
            $table->text('order_notes')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
