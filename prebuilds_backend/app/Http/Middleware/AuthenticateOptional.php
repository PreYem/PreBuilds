<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateOptional {
    public function handle(Request $request, Closure $next) {
        $bearerToken = $request->bearerToken();
        $user = null;

        if ($bearerToken) {
            $token = PersonalAccessToken::findToken($bearerToken);
            if ($token) {
                $user = $token->tokenable;
            }
        }

        // Share the authenticated user with all routes
        $request->attributes->set('authenticated_user', $user);

        return $next($request);
    }
}
