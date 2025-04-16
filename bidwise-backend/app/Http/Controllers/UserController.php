<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function profile()
    {
        try {
            $user = Auth::user();
            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions' => $user->permissions,
                    'phone' => $user->phone,
                    'location' => $user->location,
                    'bio' => $user->bio,
                    'avatar' => $user->avatar,
                    'createdAt' => $user->created_at->format('Y-m-d H:i:s'),
                    'stats' => [
                        'totalBids' => $user->bids()->count(),
                        'wonAuctions' => $user->bids()->where('status', 'won')->count(),
                        'activeListings' => $user->items()->where('status', 'active')->count(),
                        'completedSales' => $user->items()->where('status', 'completed')->count(),
                        'rating' => null,
                        'reviewCount' => null,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve profile information.'
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            
            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions' => $user->permissions,
                    'phone' => $user->phone,
                    'location' => $user->location,
                    'bio' => $user->bio,
                    'avatar' => $user->avatar,
                    'createdAt' => $user->created_at->format('Y-m-d H:i:s'),
                    'stats' => [
                        'totalBids' => $user->bids()->count(),
                        'wonAuctions' => $user->bids()->where('status', 'won')->count(),
                        'activeListings' => $user->items()->where('status', 'active')->count(),
                        'completedSales' => $user->items()->where('status', 'completed')->count(),
                        'rating' => null,
                        'reviewCount' => null,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }
    }

    /**
     * Update the authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|required|string|min:3|max:255|unique:users,username,' . Auth::id(),
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string|max:500',
            'avatar' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $user->update($request->only(['username', 'phone', 'location', 'bio', 'avatar']));

            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions' => $user->permissions,
                    'phone' => $user->phone,
                    'location' => $user->location,
                    'bio' => $user->bio,
                    'avatar' => $user->avatar,
                    'createdAt' => $user->created_at->format('Y-m-d H:i:s'),
                    'stats' => [
                        'totalBids' => $user->bids()->count(),
                        'wonAuctions' => $user->bids()->where('status', 'won')->count(),
                        'activeListings' => $user->items()->where('status', 'active')->count(),
                        'completedSales' => $user->items()->where('status', 'completed')->count(),
                        'rating' => null,
                        'reviewCount' => null,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile information.'
            ], 500);
        }
    }

    /**
     * Delete a user and all associated data
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        // Delete user's bids
        $user->bids()->delete();
        
        // Delete user's items
        $user->items()->delete();
        
        // Delete the user
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    public function index()
    {
        // Check if user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Only admins can view all users.'
            ], 403);
        }

        $users = User::where('role', '!=', 'admin')
            ->with(['bids' => function ($query) {
                $query->select('user_id', 'item_id')
                    ->groupBy('user_id', 'item_id')
                    ->havingRaw('COUNT(*) > 5');
            }])
            ->get()
            ->map(function ($user) {
                $fraudulentBids = $user->bids->groupBy('item_id')
                    ->map(function ($bids) {
                        return [
                            'item_id' => $bids->first()->item_id,
                            'count' => $bids->count()
                        ];
                    })
                    ->values()
                    ->toArray();

                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions' => $user->permissions ?? [],
                    'created_at' => $user->created_at,
                    'fraudulent_bids' => $fraudulentBids,
                ];
            });

        return response()->json($users);
    }
} 