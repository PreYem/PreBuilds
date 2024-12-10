<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;





Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

Route::get('/session', function () {
    // Check if user session exist
    
        $user_id = session('user_id');
        $user_role = session('user_role');

        if ($user_id != null && $user_role != null ) {
            return response()->json([
                'user_id' => $user_id,
                'user_role' => $user_role,
            ]);
        }
    


    // Return session data as a JSON response
    return response()->json([
        'user_id' => $user_id,
        'user_role' => $user_role,
    ]);
});