<?php



use App\Http\Controllers\usersController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [usersController::class, 'index']);



