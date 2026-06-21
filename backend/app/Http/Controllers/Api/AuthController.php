<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\UserVerificationMail;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * IMPORTANT: Handle user registration.
     * NOTE: Email uniqueness is guaranteed by the database UNIQUE INDEX.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|confirmed',
            'terms' => 'accepted',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'unverified',
                'verification_token' => $this->getUniqIdValue()
            ]);

            // Asynchronously send verification email
            Mail::to($user->email)->queue(new UserVerificationMail($user));

            return response()->json(['message' => 'Registration successful!'], 201);
            
        } catch (QueryException $e) {
            // NOTA BENE: 23000 is the SQLSTATE for integrity constraint violation.
            // 1062 is the specific error code for Duplicate Entry in MySQL.
            if ($e->getCode() == '23000' || (isset($e->errorInfo[1]) && $e->errorInfo[1] == 1062)) {
                return response()->json(['error' => 'Email already exists!'], 400);
            }
            
            return response()->json(['error' => 'Database error.'], 500);
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
     * IMPORTANT: Generates a unique token.
     * NOTE: Required by Task #5 requirement.
     */
    private function getUniqIdValue()
    {
        return bin2hex(random_bytes(16));
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
