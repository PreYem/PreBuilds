<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\usersController;

Route::get('/', function () {
    return view('welcome');
});

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