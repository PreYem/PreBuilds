<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;





Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

Route::get('/set-session', function () {
    session(['user_id' => 3, 'user_name' => 'John Doe']);
    return 'Session set!';
});


Route::get('/get-session', function () {
    $userId = session('user_id');
    $userName = session('user_name');
    return "User ID: $userId, User Name: $userName";
});
