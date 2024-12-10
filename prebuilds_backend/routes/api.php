<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;





Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

