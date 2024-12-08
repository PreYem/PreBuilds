<?php

namespace App\Http\Controllers;

use App\Models\Users; // Make sure to use the correct model name, User (singular)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    // Fetch all users
    public function index()
    {
        $users = Users::all(); // Get all users from the database
        return response()->json($users); // Return the users as JSON
    }

    // Fetch a single user by ID
    public function show($id)
    {
        $user = Users::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user); // Return the single user as JSON
    }

    // Create a new user
    public function store(Request $request)
    {
        $request->validate([
            'user_username' => 'required|string|max:255|unique:users',
            'user_email' => 'required|string|email|max:255|unique:users',
            'user_password' => 'required|string|min:8',
        ]);

        $user = new Users();
        $user->user_username = $request->user_username;
        $user->user_firstname = $request->user_firstname;
        $user->user_lastname = $request->user_lastname;
        $user->user_email = $request->user_email;
        $user->user_password = Hash::make($request->user_password); // Hash the password
        $user->user_role = $request->user_role ?? 'Client'; // Default to 'Client' if not specified
        $user->account_status = $request->account_status ?? '✔️ Unlocked'; // Default to 'Unlocked'
        $user->save();

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201); // Return success message
    }

    // Update an existing user
    public function update(Request $request, $id)
    {
        $user = Users::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'user_username' => 'required|string|max:255|unique:users,user_username,' . $user->id,
            'user_email' => 'required|string|email|max:255|unique:users,user_email,' . $user->id,
        ]);

        $user->user_username = $request->user_username;
        $user->user_firstname = $request->user_firstname;
        $user->user_lastname = $request->user_lastname;
        $user->user_email = $request->user_email;
        if ($request->has('user_password')) {
            $user->user_password = Hash::make($request->user_password); // Hash password if updated
        }
        $user->user_role = $request->user_role;
        $user->account_status = $request->account_status;
        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]); // Return success message
    }


    
    // Delete a user
    public function destroy($id)
    {
        $user = Users::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']); // Return success message
    }
}
