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
     * REQUIREMENT: Ensure only active users can perform actions.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // চেক করুন ইউজার লগইন করা আছে কি না
        if (Auth::check()) {
            $user = Auth::user();

            // REQUIREMENT: Check if user is blocked
            if ($user->status === 'blocked') {
                // ইউজারকে লগআউট করিয়ে দিন যাতে টোকেন বাতিল হয়ে যায়
                $user->tokens()->delete(); 
                
                return response()->json([
                    'error' => 'Your account is blocked by the administrator.'
                ], 403);
            }
        }

        return $next($request);
    }
}