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
