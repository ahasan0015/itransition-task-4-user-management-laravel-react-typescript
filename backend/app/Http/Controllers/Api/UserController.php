<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Requirement specified unique ID string generator utility.
     */
    public function getUniqIdValue(): string
    {
        // NOTA BENE: Generates a secure token string identifier as explicitly requested.
        return bin2hex(random_bytes(16));
    }
    /**
     * Register User
     * 
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'unverified',
                'verification_token' => $this->getUniqIdValue()
            ]);

            return response()->json(['message' => 'Registration successful! You can login now.'], 201);
        } catch (QueryException $e) {
            /**
             * FIRST REQUIREMENT & COMPLIANCE:
             * IMPORTANT: Catching the database level unique index violation exception (1062 for MySQL)
             */
            if ($e->getCode() == '23505' || $e->getCode() == '1062') {
                return response()->json(['error' => 'This email already exists in our storage level unique index!'], 400);
            }
            return response()->json(['error' => 'Database layer failure.'], 500);
        }
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
     * User List Fetch
     */
    public function index()
    {
        /**
         * Requirement #3: Data should be sorted (e.g., by the last login time).
         * Requirement #5: Always fetch fresh data. 
         * NOTE: Using 'desc' ensures the most active users appear first.
         */
        $users = User::select('id', 'name', 'email', 'status', 'last_login_time')
            ->orderBy('last_login_time', 'desc')
            ->get();

        return response()->json($users);
    }

    /**
     * Bulk Action (Block, Unblock, Delete)
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
            'action' => 'required|in:block,unblock,delete'
        ]);

        $action = $request->action;
        $ids = $request->ids;

        switch ($action) {
            case 'block':
                User::whereIn('id', $ids)->update(['status' => 'blocked']);
                break;
            case 'unblock':
                User::whereIn('id', $ids)->update(['status' => 'active']);
                break;
            case 'delete':
                User::whereIn('id', $ids)->delete();
                break;
        }

        return response()->json(['message' => 'Bulk action performed successfully.']);
    }
}
