<?php

namespace App\Http\Controllers;

use App\Models\Users;

class usersController extends Controller
{
    public function index()
    {
        // Fetch all users from the database
        $users = Users::all();

        // Return the data as JSON
        return response()->json($users);
    }
}
