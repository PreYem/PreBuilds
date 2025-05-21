<?php
namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Mail\WelcomeUserMail;
use App\Models\Users;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{

    protected $user;

    public function __construct()
    {
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            $this->user_role = $user->user_role;
            $this->user_id   = $user->user_id;
        } else {
            $this->user_role = null;
            $this->user_id   = null;
        }

        $this->localTimezone = "Africa/Casablanca";
    }

    public function index()
    {

        if ($this->user_role !== 'Owner') {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

        $users = Users::all();
        return response()->json(['users' => $users]);
    }

    public function show($id)
    {
        if ($this->user_role !== 'Owner' && $this->user_id != $id) {
            return response()->json(['databaseError' => 'Action Not Authorized. 02'], 403);
        }

        if ($this->user_role === 'Owner') {
            $user = Users::select(
                'user_id',
                'user_firstname',
                'user_lastname',
                'user_phone',
                'user_country',
                'user_address',
                'user_email',
                'user_role',
                'user_account_status'

            )
                ->where('user_id', $id)
                ->first();

        } else {
            $user = Users::select(
                'user_id',
                'user_firstname',
                'user_lastname',
                'user_phone',
                'user_country',
                'user_address',
                'user_email',
                'user_account_status'
            )
                ->where('user_id', $id)
                ->first();
        }
        $ownerCount = Users::where('user_role', 'Owner')->count();
        // Getting a head count of how many users with 'Owner' role in the database

        if (! $user) {
            return response()->json(['exists' => false, 'databaseError' => 'User not found'], 404);
        }
        return response()->json(['exists' => true, 'user' => $user, 'owner_count' => $ownerCount]);

    }

    // Creating a new user - Register

    public function store(Request $request)
    {
        if ($this->user_id) {
            return response()->json(['databaseError' => 'User already logged in.'], 403);
        }

        $errorMessage = '';

        $validator = Validator::make($request->all(), [
            'user_username'  => 'required|string|min:4|max:20|unique:users',
            'user_firstname' => 'required|string|min:3|max:30',
            'user_lastname'  => 'required|string|min:3|max:30',
            'user_phone'     => 'nullable|string|max:20',
            'user_country'   => 'nullable|string|max:50',
            'user_address'   => 'nullable|string|max:500',
            'user_email'     => 'required|string|email|max:40|unique:users',
            'user_password'  => 'required|string|min:6|max:50|confirmed',
        ]);

        $record = DB::table('password_resets')->where('email', $request->user_email)->first();

        if (! $record) {
            return response()->json([
                'databaseError' => 'No verification request found for this email.',
            ], 404);
        }

        if ($record->token !== $request->verificationCode) {
            return response()->json([
                'databaseError' => 'Invalid verification code.',
            ], 401);
        }

        DB::table('password_resets')->where('email', $request->user_email)->delete();

        if ($validator->fails()) {

            $errors = $validator->errors();

            // Sending out custom error messages for an incorrect data format

            if ($errors->has('user_username')) {
                if ($errors->first('user_username') === 'The user username has already been taken.') {
                    $errorMessage = 'Username already exists, please choose another.';
                } elseif (strlen($request->input('user_username')) > 10) {
                    $errorMessage = 'Username is too long, please try again.';
                } elseif (strlen($request->input('user_username')) < 4) {
                    $errorMessage = 'Username is too short, please try again.';
                }
            }

            if ($errors->has('user_firstname') || $errors->has('user_lastname')) {
                $errorMessage = 'First and Last names must contain between 3 and 30 characters';
            }

            if ($errors->has('user_phone')) {
                $errorMessage = 'Phone number is too long, please enter a valid phone number.';
            }

            if ($errors->has('user_address')) {
                $errorMessage = 'Home address is too long, please enter a valid home address.';
            }

            if ($errors->has('user_email')) {
                $emailError = $errors->first('user_email');

                if ($emailError === 'The user email has already been taken.') {
                    $errorMessage = 'This email is already in use, please use a different email.';
                } elseif ($emailError === 'The user email may not be greater than 40 characters.') {
                    $errorMessage = 'The email is too long, please enter an email under 40 characters.';
                } elseif ($emailError === 'The user email must be a valid email address.') {
                    $errorMessage = 'The email format is invalid, please enter a valid email.';
                }
            }

            if ($request->input('user_password') !== $request->input('user_password_confirmation')) {
                $errorMessage = 'Passwords do not match, please try again.';
            } else {
                if (strlen($request->input('user_password')) < 6 || strlen($request->input('user_password')) > 50) {
                    $errorMessage = 'Password must be between 6 and 50 characters.';
                }
            }
            return response()->json(['databaseError' => $errorMessage], 422);
        }
        $user = Users::create([
            'user_username'          => $request->user_username,
            'user_firstname'         => $request->user_firstname,
            'user_lastname'          => $request->user_lastname,
            'user_phone'             => $request->user_phone,
            'user_country'           => $request->user_country ?? 'No Country Specified',
            'user_address'           => $request->user_address,
            'user_email'             => $request->user_email,
            'user_password'          => Hash::make($request->user_password), // Hash the password
            'user_registration_date' => now(),
            'user_last_logged_at'    => now(),
        ]);

        $token = $user->createToken('prebuilds_auth-token', [$user->user_role, $user->user_id])->plainTextToken;


        Mail::to($user->user_email)->send(new WelcomeUserMail($user->user_firstname));

        return response()->json([
            'token'          => $token,
            'userData'       => [
                'user_id'        => $user->user_id,
                'user_firstname' => $user->user_firstname,
                'user_lastname'  => $user->user_lastname,
                'user_role'      => $user->user_role,
            ],
            'successMessage' => "Welcome to PreBuilds.",
        ], 201);
    }

    // Update an existing user

    public function update(Request $request, $id)
    {
        // Custom error messages

        if ($this->user_role !== "Owner" && $this->user_id != $id) {
            return response()->json(['databaseError' => 'Action Not Authorized. 03'], 403);
        }

        $customMessages = [
            'user_firstname.required' => 'First name is required.',
            'user_firstname.min'      => 'First name must be at least 3 characters long.',
            'user_firstname.max'      => 'First name cannot not contain more than 30 characters.',
            'user_lastname.required'  => 'Last name is required.',
            'user_lastname.min'       => 'Last name must be at least 3 characters.',
            'user_lastname.max'       => 'Last name may not be greater than 30 characters.',
            'user_phone.max'          => 'Phone number is too long, please enter a valid phone number.',
            'user_email.required'     => 'Email address is required.',
            'user_email.email'        => 'Please enter a valid email address.',
            'user_email.max'          => 'Email may not be greater than 40 characters.',
            'user_email.unique'       => 'This email is already in use, please use a different email.',
            'user_password.min'       => 'Password must be at least 6 characters.',
            'user_password.confirmed' => 'Passwords do not match.',
        ];

        // Validate the input fields
        $validator = Validator::make($request->all(), [
            'user_firstname' => 'required|string|min:3|max:30',
            'user_lastname'  => 'required|string|min:3|max:30',
            'user_phone'     => 'nullable|string|max:20',
            'user_country'   => 'string|max:50',
            'user_address'   => 'nullable|string|max:500',
            'user_email'     => [
                'required',
                'string',
                'email',
                'max:40',
                Rule::unique('users')->ignore($id, 'user_id'),
            ],
            'user_password'  => 'nullable|string|min:6|confirmed', // The password confirmation rule
        ], $customMessages);

        // Check if validation fails
        if ($validator->fails()) {
            // Gather the first error message
            $errorMessage = $validator->errors()->first();
            return response()->json(['databaseError' => $errorMessage], 422);
        }

        // Find the user
        $user = Users::where('user_id', $id)->first();
        if (! $user) {
            return response()->json(['databaseError' => 'User not found'], 404);
        }

        // Prepare the data to update
        $updateData = [];

        // Check if user data is different from what is already stored
        if ($request->user_firstname !== $user->user_firstname) {
            $updateData['user_firstname'] = $request->user_firstname;
        }

        if ($request->user_lastname !== $user->user_lastname) {
            $updateData['user_lastname'] = $request->user_lastname;
        }

        if ($request->user_email !== $user->user_email) {
            $updateData['user_email'] = $request->user_email;
        }

        if ($request->user_phone !== $user->user_phone) {
            $updateData['user_phone'] = $request->user_phone;
        }

        if ($request->user_address !== $user->user_address) {
            $updateData['user_address'] = $request->user_address;
        }

        if ($request->user_country !== $user->user_country) {
            $updateData['user_country'] = $request->user_country;
        }

        // Add `user_role` if provided ( not null ) and changed
        if ($request->filled('user_role')) {
            $updateData['user_role'] = $request->user_role;
        }

        // Add `user_account_status` if provided ( not null ) and changed
        if ($request->has('user_account_status') && $request->user_account_status !== $user->user_account_status) {
            $updateData['user_account_status'] = $request->user_account_status;
        }

        // Add password only if it's provided (not null) and changed
        if ($request->has('user_password') && ! empty($request->user_password)) {
            $updateData['user_password'] = Hash::make($request->user_password);
        }

        $userUpdated = Users::where('user_id', $id)->update($updateData);

        // Check if there are any changes
        if (empty($updateData)) {
            return response()->json(['successMessage' => 'No changes made. User info is up-to-date.']);
        } else {
            return response()->json(['successMessage' => 'Personal info updated successfully.']);

        }

        // Perform the update

        return response()->json(['successMessage' => 'Personal info updated successfully.']);

    }

    // Delete a user

    public function destroy($id)
    {

        if ($this->user_role !== 'Owner') {
            return response()->json(['databaseError' => 'Action Not Authorized. 04']);
        }

        $user = Users::find($id);

        if (! $user) {
            return response()->json(['databaseError' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['successMessage' => 'User deleted successfully'], 201);
        // Return success message
    }

    public function login(Request $request)
    {

        $request->validate([
            'user_username_email' => 'required|string',
            'user_password'       => 'required|string',
        ]);

        $user = Users::where('user_username', $request->user_username_email)
            ->orWhere('user_email', $request->user_username_email)
            ->select(
                'user_id',
                'user_username',
                'user_firstname',
                'user_lastname',
                'user_role',
                'user_password',
                'user_account_status',
            ) // Only select the required columns
            ->first();

        if (! $user) {
            return response()->json(['databaseError' => 'Email or Password is incorrect.'], 422);
        }

        if (! Hash::check(trim($request->user_password), trim($user->user_password))) {
            return response()->json(['databaseError' => 'Email or Password is incorrect.'], 422);
        }

        $user->tokens()->delete();

        $token = $user->createToken('prebuilds_auth-token', [$user->user_role, $user->user_id])->plainTextToken;

        Users::where('user_id', $user->user_id)
            ->update(['user_last_logged_at' => now()]);

        if ($user->user_account_status === 'Locked') {
            return response()->json(['databaseError' => 'Account is locked, please contact the domain manager.'], 401);
        }

        return response()->json([
            'token'    => $token,
            'userData' => [
                'user_id'        => $user->user_id,
                'user_firstname' => $user->user_firstname,
                'user_lastname'  => $user->user_lastname,
                'user_role'      => $user->user_role,
            ],
        ]);
    }

    public function getSessionData()
    {
        $user = Auth::guard('sanctum')->user();

        if (! $user) {
            return response()->json(['databaseError' => 'Action Not Authorized. 05'], 401);
        }

        return response()->json([
            'userData' => [
                'user_id'             => $user->user_id,
                'user_firstname'      => $user->user_firstname,
                'user_lastname'       => $user->user_lastname,
                'user_role'           => $user->user_role,
                'user_phone'          => $user->user_phone,
                'user_address'        => $user->user_address,
                'user_account_status' => $user->user_account_status,
            ],
        ], 201);

    }

    public function logout()
    {
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            $user->currentAccessToken()->delete();

            return response()->json(['successMessage' => "You've been logged out."]);
        } else {
            return response()->json(['databaseError' => "You're already logged out."], 401);
        }
    }

    public function ForgotPassword(Request $request)
    {
        if ($this->user_id !== null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 04']);
        }

        if (empty($request->user_email)) {
            return response()->json(['databaseError' => 'An email address is required.'], 422);
        }

        if (! filter_var($request->user_email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['databaseError' => 'The email address format is not valid.'], 422);
        }

        $user = Users::where('user_email', $request->user_email)->first();

        if (! $user) {
            return response()->json(['databaseError' => 'Email incorrect or not found.'], 404);
        }

        // Check if a recent token already exists
        $existing = DB::table('password_resets')->where('email', $request->user_email)->first();

        if ($existing) {
            $createdAt = \Carbon\Carbon::parse($existing->created_at, $this->localTimezone)->setTimezone($this->localTimezone);
            $now       = \Carbon\Carbon::now($this->localTimezone);

            $minutesSince = $createdAt->diffInMinutes($now); // Ensures always positive

            if ($minutesSince < 1) {
                return response()->json([
                    'databaseError' => 'Too many requests. Please wait a few minutes before trying again.',
                ], 429);
            }

            DB::table('password_resets')->where('email', $request->user_email)->delete();
        }

        $token = Str::random(10);

        // Insert new token
        DB::table('password_resets')->insert([
            'email'      => $request->user_email,
            'token'      => $token,
            'created_at' => \Carbon\Carbon::now($this->localTimezone),
        ]);

        Mail::to($request->user_email)->send(new ResetPasswordMail(
            $token,
            'Prebuilds Reset Code',
            'Password Reset',
            'Use the following code to reset your password:'
        ));
        return response()->json([
            'successMessage'      => 'A verification code has been sent to your mail. - ',
            'user_email_forReset' => $user->user_email,
        ]);
    }

    public function VerifyToken(Request $request)
    {
        if ($this->user_id !== null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 04'], 403);
        }

        $user   = Users::where('user_email', $request->user_email)->first();
        $record = DB::table('password_resets')->where('email', $request->user_email)->first();

        if (! $user || ! $record || $record->token !== $request->token) {
            return response()->json(['databaseError' => 'Error: Unable to verify token, please verify the email you provided.'], 404);
        }

                                                                               // ✅ Check token age
        $createdAt = Carbon::parse($record->created_at, $this->localTimezone); // or 'Africa/Casablanca'
        $now       = Carbon::now($this->localTimezone);

        if (abs($now->diffInMinutes($createdAt)) > 5) {
            DB::table('password_resets')
                ->where('email', $request->user_email)
                ->delete();

            return response()->json([
                'databaseError' => 'Token has expired. Please request a new one.',
            ], 410);
        }

        return response()->json([
            'successMessage' => 'Token verified. Please reset your password.',
            'token'          => $record->token,
        ], 200);
    }

    public function ResetPassword(Request $request)
    {
        if ($this->user_id !== null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 04']);
        }

        if (empty($request->user_email) || empty($request->token)) {
            return response()->json(['databaseError' => 'Error: Unable to verify token, please verify the email you provided.'], 404);
        }

        if (empty($request->user_password) || empty($request->user_password_confirmation) || $request->user_password_confirmation !== $request->user_password) {
            return response()->json(['databaseError' => 'Please verify your password inputs.'], 404);
        }

        $user = Users::where('user_email', $request->user_email)->first();

        $record = DB::table('password_resets')->where('email', $request->user_email)->first();

        $token = $record ? $record->token : null;

        if ($token !== $request->token || $token === null) {
            return response()->json(['databaseError' => 'Error: Unable to verify token, please verify the email you provided.'], 404);

        }

        $createdAt = Carbon::parse($record->created_at, $this->localTimezone);
        $now       = Carbon::now($this->localTimezone);

        if (abs($now->diffInMinutes($createdAt)) > 5) {
            return response()->json([
                'databaseError' => 'Token has expired. Please request a new one. Created at: ' . $now->diffInMinutes($createdAt) . " - " . $record->created_at . " - " . $now,
            ], 410);
        }

        DB::table('password_resets')
            ->where('email', $request->user_email)
            ->where('token', $request->token)
            ->delete();
        $user->user_password = $request->user_password;
        $user->save();

        Mail::to($user->user_email)->send(new ResetPasswordMail(
            "",
            'Prebuilds Password Reset',
            'Your PreBuilds account password has been reseted',
            "If you didn't expect this email, please secure your account immediately."
        ));

        return response()->json([
            'successMessage' => 'Password successfully reset. You can now log in with your new password.',
        ]);

    }

    public function RegisterVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_username'  => 'required|string|min:4|max:20|unique:users',
            'user_firstname' => 'required|string|min:3|max:30',
            'user_lastname'  => 'required|string|min:3|max:30',
            'user_phone'     => 'nullable|string|max:20',
            'user_country'   => 'nullable|string|max:50',
            'user_address'   => 'nullable|string|max:500',
            'user_email'     => 'required|string|email|max:40|unique:users',
            'user_password'  => 'required|string|min:6|max:50|confirmed',
        ]);

        if ($validator->fails()) {
            $errors       = $validator->errors();
            $errorMessage = '';

            if ($errors->has('user_username')) {
                $msg          = $errors->first('user_username');
                $errorMessage = match ($msg) {
                    'The user username has already been taken.' => 'Username already exists, please choose another.',
                    default =>(strlen($request->user_username) < 4)
                    ? 'Username is too short, please try again.'
                    : 'Username is too long, please try again.',
                };
            } elseif ($errors->has('user_firstname') || $errors->has('user_lastname')) {
                $errorMessage = 'First and Last names must contain between 3 and 30 characters.';
            } elseif ($errors->has('user_phone')) {
                $errorMessage = 'Phone number is too long, please enter a valid phone number.';
            } elseif ($errors->has('user_address')) {
                $errorMessage = 'Home address is too long, please enter a valid home address.';
            } elseif ($errors->has('user_email')) {
                $msg          = $errors->first('user_email');
                $errorMessage = match ($msg) {
                    'The user email has already been taken.' => 'This email is already in use, please use a different email.',
                    'The user email may not be greater than 40 characters.' => 'The email is too long, please enter an email under 40 characters.',
                    'The user email must be a valid email address.' => 'The email format is invalid, please enter a valid email.',
                    default => 'Invalid email address.',
                };
            } elseif ($request->user_password !== $request->user_password_confirmation) {
                $errorMessage = 'Passwords do not match, please try again.';
            } elseif (strlen($request->user_password) < 6 || strlen($request->user_password) > 50) {
                $errorMessage = 'Password must be between 6 and 50 characters.';
            }

            return response()->json(['databaseError' => $errorMessage], 422);
        }

        // $user = Users::create([
        //     'user_username'          => $request->user_username,
        //     'user_firstname'         => $request->user_firstname,
        //     'user_lastname'          => $request->user_lastname,
        //     'user_phone'             => $request->user_phone,
        //     'user_country'           => $request->user_country ?? 'No Country Specified',
        //     'user_address'           => $request->user_address,
        //     'user_email'             => $request->user_email,
        //     'user_password'          => Hash::make($request->user_password),
        //     'user_registration_date' => now(),
        //     'user_last_logged_at'    => now(),
        // ]);

        // $token = $user->createToken('prebuilds_auth-token', [$user->user_role, $user->user_id])->plainTextToken;

        $existing = DB::table('password_resets')->where('email', $request->user_email)->first();

        if ($existing) {

            $createdAt = Carbon::parse($existing->created_at, $this->localTimezone)->setTimezone($this->localTimezone);
            $now       = Carbon::now($this->localTimezone);

            $minutesSince = abs($now->diffInMinutes($createdAt, false));

            if ($minutesSince < 5) {
                return response()->json([
                    'databaseError' => 'A verification code has already been sent recently. Please wait before trying again.',
                ], 429); // 429 Too Many Requests
            }

            // deleting token if it exists but is older than the condition timer
            DB::table('password_resets')->where('email', $request->user_email)->delete();
        }

        $token = Str::random(10);

        DB::table('password_resets')->insert([
            'email'      => $request->user_email,
            'token'      => $token,
            'created_at' => \Carbon\Carbon::now($this->localTimezone), // sets time in Europe/Paris timezone
        ]);

        Mail::to($request->user_email)->send(new ResetPasswordMail(
            $token,
            'Prebuilds Verification Code',
            'Account Verification',
            'Use the following code to verify your account:'
        ));

        return response()->json([
            'successMessage' => 'Email Verification : Please insert the code sent to your email.',
        ]);

        // return response()->json([
        //     'token'    => $token,
        //     'userData' => [
        //         'user_id'        => $user->user_id,
        //         'user_firstname' => $user->user_firstname,
        //         'user_lastname'  => $user->user_lastname,
        //         'user_role'      => $user->user_role,
        //     ],
        // ], 201);
    }

}
