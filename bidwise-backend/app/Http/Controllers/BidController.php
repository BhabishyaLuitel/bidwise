<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Item;
use App\Events\NewBidPlaced;
use App\Events\BidPlaced;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{
    /**
     * Display a listing of bids for an item
     */
    public function index(Item $item)
    {
        $bids = $item->bids()
            ->with('user:id,username')
            ->orderBy('amount', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Store a newly created bid
     */
    public function store(Request $request, Item $item)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        if ($item->status !== 'active') {
            return response()->json(['message' => 'This auction has ended'], 400);
        }

        if ($item->user_id === Auth::id()) {
            return response()->json(['message' => 'You cannot bid on your own item'], 400);
        }

        if ($request->amount <= $item->currentBid) {
            return response()->json(['message' => 'Bid amount must be higher than current bid'], 400);
        }

        try {
            DB::beginTransaction();

            // Update existing bids to outbid
            Bid::where('item_id', $item->id)
                ->where('status', 'active')
                ->update(['status' => 'outbid']);

            // Create new bid
            $bid = Bid::create([
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'amount' => $request->amount,
                'status' => 'active',
                'timestamp' => now(),
            ]);

            // Update item's current bid
            $item->update([
                'current_bid' => $request->amount,
                'total_bids' => $item->total_bids + 1,
            ]);

            DB::commit();

            // Load the bid with user data
            $bid->load('user');

            // Broadcast the bid event
            broadcast(new BidPlaced($bid))->toOthers();

            return response()->json([
                'message' => 'Bid placed successfully',
                'bid' => $bid,
                'next_minimum_bid' => $bid->amount + 1,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e], 500);
        }
    }

    /**
     * Display the specified bid
     */
    public function show(Bid $bid)
    {
        return response()->json($bid->load(['user:id,username', 'item']));
    }

    /**
     * Get user's bids with status
     */
    public function userBids()
    {
        $bids = Auth::user()->bids()
            ->with('item')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Get user's active bids
     */
    public function activeBids()
    {
        $bids = Auth::user()->bids()
            ->active()
            ->with('item')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Get user's won bids
     */
    public function wonBids()
    {
        $bids = Auth::user()->bids()
            ->won()
            ->with('item')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Get user's outbid bids
     */
    public function outbidBids()
    {
        $bids = Auth::user()->bids()
            ->outbid()
            ->with('item')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Get user's lost bids
     */
    public function lostBids()
    {
        $bids = Auth::user()->bids()
            ->lost()
            ->with('item')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bids);
    }

    /**
     * Remove the specified bid
     */
    public function destroy(Bid $bid)
    {
        // Check if user owns the bid
        if ($bid->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if auction is still active
        if ($bid->item->end_time < now()) {
            return response()->json(['message' => 'Cannot delete bid after auction has ended'], 400);
        }

        try {
            DB::beginTransaction();

            // If this was the highest bid, update item's current bid
            if ($bid->isHighestBid()) {
                $nextHighestBid = $bid->item->bids()
                    ->where('id', '!=', $bid->id)
                    ->orderBy('amount', 'desc')
                    ->first();

                if ($nextHighestBid) {
                    $bid->item->update(['current_bid' => $nextHighestBid->amount]);
                    $nextHighestBid->update(['status' => 'active']);
                } else {
                    $bid->item->update(['current_bid' => $bid->item->starting_price]);
                }
            }

            // Delete the bid
            $bid->delete();

            // Update item's total bids
            $bid->item->decrement('total_bids');

            DB::commit();

            return response()->json(['message' => 'Bid deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete bid'], 500);
        }
    }
}
