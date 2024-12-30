<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\SubCategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use Illuminate\Session\Middleware\StartSession;




Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('subcategories', SubCategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

Route::apiResource('products', ProductsController::class); // Listing and managing products


Route::post('/login', [UsersController::class, 'login']); // Logging user in and starting sessions

Route::post('/logout', [UsersController::class, 'logout']); // Logging user out by reseting sessions

Route::get('/getSessionData', [UsersController::class, 'getSessionData']); // Sending sessia data to the frontend

Route::get('/NavBarCategories', [CategoriesController::class, 'NavBarCategories']); // Listing and managing categories
