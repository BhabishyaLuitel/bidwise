<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of items
     */
    public function index(Request $request)
    {
        $query = Item::with('user:id,username');

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('minPrice')) {
            $query->where('current_bid', '>=', $request->minPrice);
        }

        if ($request->has('maxPrice')) {
            $query->where('current_bid', '<=', $request->maxPrice);
        }

        // Apply sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('current_bid', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('current_bid', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'ending_soon':
                    $query->orderBy('end_time', 'asc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginate results
        $perPage = $request->input('perPage', 12);
        $items = $query->paginate($perPage);

        return response()->json($items);
    }

    /**
     * Store a newly created item
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'required|array|min:1|max:4',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'starting_price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'end_time' => 'required|date|after:now',
        ]);

        try {
            DB::beginTransaction();

            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('items', 'public');
                $images[] = '/storage/' . $path;
            }

            $item = Item::create([
                'title' => $request->title,
                'description' => $request->description,
                'images' => $images,
                'starting_price' => $request->starting_price,
                'current_bid' => $request->starting_price,
                'user_id' => Auth::id(),
                'category' => $request->category,
                'end_time' => $request->end_time,
                'status' => 'active',
                'total_bids' => 0,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Item created successfully',
                'item' => $item->load('user:id,username')
            ], 201);

        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create item. Please try again.'], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An unexpected error occurred. Please try again.'], 500);
        }
    }

    /**
     * Display the specified item
     */
    public function show(Item $item)
    {
        return response()->json($item->load([
            'user:id,username',
            'highestBid.user:id,username',
            'bids' => function ($query) {
                $query->with('user:id,username')
                      ->orderBy('amount', 'desc')
                      ->limit(10);
            }
        ]));
    }

    /**
     * Update the specified item
     */
    public function update(Request $request, Item $item)
    {
        // Check if user owns the item
        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if item has bids
        if ($item->total_bids > 0) {
            return response()->json(['message' => 'Cannot edit item that has bids'], 400);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'sometimes|array|min:1|max:4',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'starting_price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'end_time' => 'required|date|after:now',
        ]);

        try {
            DB::beginTransaction();

            $data = [
                'title' => $request->title,
                'description' => $request->description,
                'starting_price' => $request->starting_price,
                'current_bid' => $request->starting_price,
                'category' => $request->category,
                'end_time' => $request->end_time,
            ];

            // Handle image uploads if provided
            if ($request->hasFile('images')) {
                $images = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('items', 'public');
                    $images[] = '/storage/' . $path;
                }
                $data['images'] = $images;
            }

            $item->update($data);

            DB::commit();

            return response()->json([
                'message' => 'Item updated successfully',
                'item' => $item->load('user:id,username')
            ]);

        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update item. Please try again.'], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An unexpected error occurred. Please try again.'], 500);
        }
    }

    /**
     * Remove the specified item
     */
    public function destroy(Item $item)
    {
        // Check if user owns the item
        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if item has bids
        if ($item->total_bids > 0) {
            return response()->json(['message' => 'Cannot delete item that has bids'], 400);
        }

        try {
            DB::beginTransaction();
            $item->delete();
            DB::commit();

            return response()->json(['message' => 'Item deleted successfully']);

        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete item. Please try again.'], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An unexpected error occurred. Please try again.'], 500);
        }
    }

    /**
     * Get featured items
     */
    public function featured()
    {
        $items = Item::where('status', 'active')
            ->where('end_time', '>', now())
            ->orderBy('total_bids', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->images[0] ?? null,
                    'currentBid' => $item->current_bid,
                    'timeLeft' => $item->end_time->diffForHumans(),
                ];
            });

        return response()->json(['data' => $items]);
    }

    /**
     * Get seller's items
     */
    public function sellerItems()
    {
        $items = Item::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($items);
    }
} 