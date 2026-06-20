<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserVerificationMail;

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
    // IMPORTANT: 'confirmed' rule  password_confirmation 
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|confirmed', // password_confirmation 
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

        Mail::to($user->email)->queue(new UserVerificationMail($user));

        return response()->json(['message' => 'Registration successful!'], 201);
        } catch (QueryException $e) {
        if ($e->getCode() == '23505' || $e->getCode() == '1062') {
            return response()->json(['error' => 'Email already exists!'], 400);
        }
        return response()->json(['error' => 'Database error.'], 500);
        }
    }

        //verification method
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
 * Logout User
 */
public function logout(Request $request)
{
    // token remove
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out successfully!']);
}

    /**
     * User List Fetch
     */
public function index(Request $request)
{
    // search query parameter
    $search = $request->query('search');

    // 1. select only required fields 2. search by name or email 3. sort by last login time desc 4. paginate results
   $users = User::select('id', 'name', 'email', 'status', 'last_login_time')
    ->when($search, function ($query, $search) {
        return $query->where('name', 'LIKE', "%{$search}%")
                     ->orWhere('email', 'LIKE', "%{$search}%")
                     ->orWhere('status', 'LIKE', "%{$search}%");
    })
    ->orderBy('last_login_time', 'desc')
    ->paginate(10);
    return response()->json([
        'users' => [
            'data' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ]
    ]);
}

    /**
     * Bulk Action (Block, Unblock, Delete)
     */
    public function bulkAction(Request $request)
{
    // IMPORTANT: 'delete_unverified'  'ids' sperate handling for unverified users deletion
    $request->validate([
        'action' => 'required|in:block,unblock,delete,delete_unverified'
    ]);

    $action = $request->action;
    $ids = $request->ids ?? [];

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
        case 'delete_unverified':
            // NOTE: if IDs are provided, only those will be deleted; otherwise, all unverified users will be deleted
            $query = User::where('status', 'unverified');
            if (!empty($ids)) {
                $query->whereIn('id', $ids);
            }
            $query->delete();
            break;
    }

    return response()->json(['message' => 'Bulk action performed successfully.']);
}
}
