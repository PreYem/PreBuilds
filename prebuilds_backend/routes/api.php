<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use Illuminate\Session\Middleware\StartSession;





Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

Route::apiResource('products', ProductsController::class); // Listing and managing products



// Route::post('/login', [UsersController::class, 'login']); // When a user tries to login

Route::post('/login', [UsersController::class, 'login']);

// Route::middleware('web')->group(function () {
//     // Define your routes that require session
    
//     Route::get('/user/session', [UsersController::class, 'getSessionData']);
//     Route::post('/logout', [UsersController::class, 'logout']);
// });








// Route::middleware([StartSession::class])->group(function () {
//     Route::get('/session', function () {
        
//         $user_id = session()->get('user_id');
//         $user_role = session()->get('user_role');
    
//         return response()->json([
//             'user_id' => $user_id,
//             'user_role' => $user_role
//         ]);
//     });
// });