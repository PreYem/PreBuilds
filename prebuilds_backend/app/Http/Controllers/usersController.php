<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use App\Models\Sessions;

class UsersController extends Controller
{

    public function index()
    {
        $users = Users::all();
        return response()->json($users);
    }


    public function show($id)
    {
        $user = Users::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }





    // Creating a new user
    public function store(Request $request)
    {
        $errorMessage = "";

        $validator = Validator::make($request->all(), [
            'user_username' => 'required|string|min:4|max:20|unique:users',
            'user_firstname' => 'required|string|min:3|max:30',
            'user_lastname' => 'required|string|min:3|max:30',
            'user_phone' => 'nullable|string|max:20',
            'user_country' => 'nullable|string|max:50',
            'user_address' => 'nullable|string|max:500',
            'user_email' => 'required|string|email|max:40|unique:users',
            'user_password' => 'required|string|min:6|max:50|confirmed',
        ]);

        if ($validator->fails()) {

            $errors = $validator->errors();

            // Sending out custom error messages for an incorrect data format

            if ($errors->has('user_username')) {
                if ($errors->first('user_username') === 'The user username has already been taken.') {
                    $errorMessage = "Username already exists, please choose another.";
                } elseif (strlen($request->input('user_username')) > 10) {
                    $errorMessage = "Username is too long, please pick another one.";
                } elseif (strlen($request->input('user_username')) < 4) {
                    $errorMessage = "Username is too short, please pick another one.";
                }
            }

            if ($errors->has('user_firstname') || $errors->has('user_lastname')) {
                $errorMessage = "First and Last names must contain between 3 and 30 characters";
            }

            if ($errors->has('user_phone')) {
                $errorMessage = "Phone number is too long, please enter a valid phone number.";
            }

            if ($errors->has('user_address')) {
                $errorMessage = "Home address is too long, please enter a valid home address.";
            }

            if ($errors->has('user_email')) {
                $emailError = $errors->first('user_email');

                if ($emailError === 'The user email has already been taken.') {
                    $errorMessage = "This email is already in use, please use a different email.";
                } elseif ($emailError === 'The user email may not be greater than 40 characters.') {
                    $errorMessage = "The email is too long, please enter an email under 40 characters.";
                } elseif ($emailError === 'The user email must be a valid email address.') {
                    $errorMessage = "The email format is invalid, please enter a valid email.";
                }
            };

            if ($request->input('user_password') !== $request->input('user_password')) {
                $errorMessage = "Passwords do not match, please try again.";
            } else {
                if (strlen($request->input('user_password')) < 6 || strlen($request->input('user_password')) > 50) {
                    $errorMessage = "Password must be between 6 and 50 characters.";
                }
            }

            return response()->json(['databaseError' => $errorMessage], 422);
        }


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


        session([
            'user_id' => 'TESTING' ,  // Use user_id from the newly created user
            'user_role' => 'TESTING',  // Set default role or get it from the user model
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




