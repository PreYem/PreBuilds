<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key for sessions table
            $table->unsignedBigInteger('user_id')->nullable(); // unsignedBigInteger matches 'users.id'
            $table->text('payload'); // Serialized session data
            $table->integer('last_activity'); // Timestamp of last activity
            $table->timestamps();

            // Define foreign key constraint to reference the users table
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sessions');
    }
};


