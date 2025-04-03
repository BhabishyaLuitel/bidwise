<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of items with filters
     */
    public function index(Request $request)
    {
        $query = Item::query()
            ->with([
                'user:id,username',
                'highestBid.user:id,username',
            ])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->category && $request->category !== 'All Categories', function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->status, function ($query, $status) {
                switch ($status) {
                    case 'active':
                        $query->where('status', 'active')
                              ->where('end_time', '>', now());
                        break;
                    case 'ending_soon':
                        $query->where('status', 'active')
                              ->where('end_time', '>', now())
                              ->where('end_time', '<=', now()->addHours(24));
                        break;
                    case 'ended':
                        $query->where(function ($q) {
                            $q->where('status', 'ended')
                              ->orWhere('end_time', '<=', now());
                        });
                        break;
                }
            })
            ->when($request->minPrice, function ($query, $minPrice) {
                $query->where('current_bid', '>=', $minPrice);
            })
            ->when($request->maxPrice, function ($query, $maxPrice) {
                $query->where('current_bid', '<=', $maxPrice);
            })
            ->when($request->sort, function ($query, $sort) {
                switch ($sort) {
                    case 'newest':
                        $query->orderBy('created_at', 'desc');
                        break;
                    case 'ending':
                        $query->orderBy('end_time', 'asc');
                        break;
                    case 'price_asc':
                        $query->orderBy('current_bid', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('current_bid', 'desc');
                        break;
                    case 'bids':
                        $query->orderBy('total_bids', 'desc');
                        break;
                    default:
                        $query->orderBy('created_at', 'desc');
                }
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            });

        $items = $query->paginate($request->perPage ?? 12);

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

            return response()->json($item->load('user:id,username'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e], 500);
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

        // Check if item can be edited
        if ($item->hasEnded() || $item->total_bids > 0) {
            return response()->json(['message' => 'Cannot edit item after it has ended or received bids'], 400);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'nullable|array|min:1|max:4',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'starting_price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'end_time' => 'required|date|after:now',
        ]);

        try {
            DB::beginTransaction();

            $data = $request->except('images');

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

            return response()->json($item->load('user:id,username'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update item'], 500);
        }
    }

    /**
     * Remove the specified item
     */
    public function destroy(Item $item)
    {
        // Check if the authenticated user is the seller
        if ($item->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if item can be deleted
        if ($item->hasEnded() || $item->total_bids > 0) {
            return response()->json(['message' => 'Cannot delete item after it has ended or received bids'], 400);
        }

        try {
            DB::beginTransaction();

            // Delete images from storage
            foreach ($item->images as $image) {
                // Remove the /storage/ prefix to get the actual file path
                $path = str_replace('/storage/', '', $image);
                Storage::disk('public')->delete($path);
            }

            $item->delete();

            DB::commit();

            return response()->json(['message' => 'Item deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete item'], 500);
        }
    }

    /**
     * Get items for the authenticated seller
     */
    public function sellerItems()
    {
        $items = Item::where('user_id', Auth::id())
            ->with(['bids' => function ($query) {
                $query->orderBy('amount', 'desc');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'images' => $item->images,
                    'category' => $item->category,
                    'startingPrice' => $item->starting_price,
                    'currentBid' => $item->current_bid,
                    'totalBids' => $item->bids->count(),
                    'status' => $item->status,
                    'endTime' => $item->end_time,
                    'createdAt' => $item->created_at,
                    'updatedAt' => $item->updated_at,
                ];
            });

        return response()->json($items);
    }

    public function featured()
    {
        \Log::info('Fetching featured items');
        
        $items = Item::with(['highestBid.user:id,username'])
            ->where('status', 'active')
            ->where('end_time', '>', now())
            ->orderBy('current_bid', 'desc')
            ->limit(3)
            ->get();
            
        \Log::info('Found ' . $items->count() . ' items');
        
        $mappedItems = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->images[0] ?? null,
                'currentBid' => $item->current_bid,
                'timeLeft' => $this->getTimeLeft($item->end_time),
            ];
        });

        \Log::info('Mapped items:', $mappedItems->toArray());

        return response()->json(['data' => $mappedItems]);
    }

    private function getTimeLeft($endTime)
    {
        $now = now();
        $end = \Carbon\Carbon::parse($endTime);
        $diff = $now->diff($end);

        if ($diff->days > 0) {
            return $diff->days . 'd ' . $diff->h . 'h';
        }
        if ($diff->h > 0) {
            return $diff->h . 'h ' . $diff->i . 'm';
        }
        return $diff->i . 'm ' . $diff->s . 's';
    }
} 