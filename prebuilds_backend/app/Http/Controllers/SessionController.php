<?php

namespace App\Http\Controllers;

use App\Models\Sessions;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;



class SessionController extends Controller
{
    /**
     * Create a new session for the user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSession(Request $request)
    {
        // Assume user has logged in successfully
        $user = Users::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Generate a new session ID
        $sessionId = Str::random(40);  // Generate a random session ID (can be any string length)

        // Create a new session in the database
        $session = Sessions::create([
            'session_id' => $sessionId,
            'user_id' => $user->id,
            'last_activity' => Carbon::now(),
        ]);

        // Store session ID in the user's browser as a cookie (secure and HttpOnly)
        Cookie::queue('session_id', $sessionId, 60); // Session cookie that expires in 60 minutes

        return response()->json(['message' => 'Session created', 'session_id' => $sessionId]);
    }

    /**
     * Retrieve the user based on the session ID stored in the cookie.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSession(Request $request)
    {
        // Retrieve the session ID from the cookie
        $sessionId = $request->cookie('session_id');

        if (!$sessionId) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Find the session in the database
        $session = Sessions::where('session_id', $sessionId)->first();

        if (!$session) {
            return response()->json(['error' => 'Invalid session'], 401);
        }

        // Get the user associated with this session
        $user = Users::find($session->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update the last activity timestamp
        $session->update(['last_activity' => Carbon::now()]);

        return response()->json(['user' => $user]);
    }

    /**
     * Clear the session (logout).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $sessionId = $request->cookie('session_id');

        if (!$sessionId) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Delete the session from the database
        Sessions::where('session_id', $sessionId)->delete();

        // Remove the session cookie from the browser
        Cookie::queue(Cookie::forget('session_id'));

        return response()->json(['successMessage' => 'Logged out successfully']);
    }
}