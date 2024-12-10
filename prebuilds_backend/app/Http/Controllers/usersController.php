<?php

namespace App\Http\Controllers;

use App\Models\Users; // Make sure to use the correct model name, User (singular)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
        // Define custom error messages
        $errorMessages = [];

        // Validate the request with the initial validation rules
        $validator = Validator::make($request->all(), [
            'user_username' => 'required|string|max:255|unique:users',
            'user_firstname' => 'required|string|max:255',
            'user_lastname' => 'required|string|max:255',
            'user_phone' => 'required|string|max:20',
            'user_country' => 'nullable|string|max:50',
            'user_address' => 'required|string|max:500',
            'user_email' => 'required|string|email|max:255|unique:users',
            'user_password' => 'required|string|min:6|max:50|confirmed',
        ]);

        // Check validation failures and customize error messages based on the validation rule
        if ($validator->fails()) {
            // Check if the username is invalid
            if ($validator->errors()->has('user_username')) {
                $errorMessages = 'Username already exists. Please choose a different username.';
            }

            // Check if the email is invalid
            if ($validator->errors()->has('user_email')) {
                $errorMessages = 'Email already registered. Please choose a different email.';
            }

            // Check if the password is too short
            $password = $request->input('user_username');

            if ($password === "BRUH") {
                $errorMessages = 'LAME';
            }

            // Return the customized error messages
            return response()->json(['databaseError' => $errorMessages], 422);
        }

        // Proceed with user creation if validation passes
        Users::create([
            'user_username' => $request->user_username,
            'user_firstname' => $request->user_firstname,
            'user_lastname' => $request->user_lastname,
            'user_phone' => $request->user_phone,
            'user_country' => $request->user_country ?? 'No Country Specified',
            'user_address' => $request->user_address,
            'user_email' => $request->user_email,
            'user_password' => Hash::make($request->user_password),
            'user_registration_date' => now(), // Set registration date here
        ]);

        return response()->json(['successMessage' => 'User registered successfully'], 201);
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
