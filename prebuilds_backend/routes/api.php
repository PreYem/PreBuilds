<?php



// use App\Http\Controllers\usersController;
use App\Http\Controllers\categoriesController;
use Illuminate\Support\Facades\Route;

// Route::get('/users', [usersController::class, 'index']);

Route::get('/categories', [categoriesController::class, 'index']);



