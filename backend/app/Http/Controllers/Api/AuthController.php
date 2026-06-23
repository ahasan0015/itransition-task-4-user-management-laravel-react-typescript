<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\UserVerificationMail;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * IMPORTANT: Handle user registration.
     * NOTE: Email uniqueness is guaranteed by the database UNIQUE INDEX.
     */
public function register(Request $request)
{
    // 1. Validation
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'terms' => 'accepted', 
    ], [
        // Custom error messages (these will be displayed on the frontend)
        'email.unique' => 'This email has already been used, please use another email.',
        'terms.accepted' => 'You must agree to the terms and conditions.',
    ]);

    // 2. If validation fails
    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation error', 
            'errors' => $validator->errors() // all errors are being sent here
        ], 422);
    }

    try {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'unverified',
            'verification_token' => $this->getUniqIdValue()
        ]);

        // 3. Send email
        try {
            Mail::to($user->email)->send(new UserVerificationMail($user));
        } catch (\Exception $e) {
            Log::error('Mail Error: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Registration completed successfully! Please check your email.'], 201);
            
    } catch (\Exception $e) {
        Log::error('Registration Error: ' . $e->getMessage());
        return response()->json(['message' => 'Server error occurred, please try again later.'], 500);
    }
}
//token verification method
     public function verify($token)
    {
        $user = User::where('verification_token', $token)->first();
            if ($user) {
        $user->update(['status' => 'active', 'verification_token' => null]);
        return "Account activated successfully!";
    }
    return "Invalid token!";
}
  /**
     * IMPORTANT: Generates a unique token.
     * NOTE: Required by Task #5 requirement.
     */
    private function getUniqIdValue()
    {
        return bin2hex(random_bytes(16));
    }

/**
     * Login User
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }

        //  // Check if user is blocked
        if ($user->status === 'blocked') {
            return response()->json(['error' => 'Your account is currently blocked by admin.'], 403);
        }

        // For Sorting Update last login time
        $user->last_login_time = now();
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }


  
        /**
 * Logout User
 */
public function logout(Request $request)
{
    // token remove
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out successfully!']);
}


}
