<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated first
        if (Auth::check()) {
            $user = Auth::user();

            // check if the user's status is 'blocked'
            // NOTE: if the status is 'blocked', we will log out the user and return a JSON response with a message
            if ($user->status === 'blocked') {
                
                // totally log out the user by deleting all their tokens 
                $user->tokens()->delete(); 
                
                // User Logout and Session Invalidateion
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                // ৩. JSON response with message for user
                // IMPORTANT: status code 403 means "Forbidden" which indicates that the server understands the request but refuses to authorize it. This is appropriate for blocked users.
                return response()->json([
                    'message' => 'Your account has been blocked by the administrator.'
                ], 403);
            }
        }

        return $next($request);
    }
}