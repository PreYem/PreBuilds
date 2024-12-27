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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); // Primary key, auto-incrementing
            $table->string('user_username')->unique(); // Unique username
            $table->string('user_firstname');
            $table->string('user_lastname');
            $table->string('user_phone')->nullable(); // Phone is optional
            $table->string('user_country')->nullable(); // Country is optional
            $table->text('user_address')->nullable(); // Address is optional
            $table->string('user_email')->unique(); // Unique email
            $table->string('user_password'); // Password (will be hashed)
            
            $table->enum('user_role', ['Owner', 'Admin', 'Client'])->default('Client'); // Default role is 'Client'
            $table->enum('user_account_status', ['🔒 Locked', '✔️ Unlocked'])->default('✔️ Unlocked'); // Account status
            $table->timestamp('user_registration_date')->useCurrent(); // Default to current timestamp
            $table->timestamp('user_last_logged_at')->nullable(); // Last login timestamp
            $table->timestamps(0); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
