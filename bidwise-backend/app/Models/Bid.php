<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'user_id',
        'amount',
        'timestamp',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'timestamp' => 'datetime',
    ];

    /**
     * Get the item that owns the bid
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the user that owns the bid
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this bid is the highest bid
     */
    public function isHighestBid(): bool
    {
        return $this->item->current_bid === $this->amount;
    }

    /**
     * Check if this bid has won the auction
     */
    public function hasWon(): bool
    {
        return $this->isHighestBid() && $this->item->end_time < now();
    }

    /**
     * Check if this bid has been outbid
     */
    public function hasBeenOutbid(): bool
    {
        return !$this->isHighestBid() && $this->item->end_time > now();
    }

    /**
     * Get the next minimum bid amount
     */
    public static function getNextMinimumBid(Item $item): float
    {
        return $item->current_bid + 1;
    }

    /**
     * Get the bid status
     */
    public function getStatusAttribute(): string
    {
        if ($this->hasWon()) {
            return 'won';
        }
        if ($this->hasBeenOutbid()) {
            return 'outbid';
        }
        if ($this->item->end_time < now()) {
            return 'lost';
        }
        return 'active';
    }

    /**
     * Update bid status based on current state
     */
    public function updateStatus(): void
    {
        $this->update(['status' => $this->status]);
    }

    /**
     * Scope a query to only include active bids
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include won bids
     */
    public function scopeWon($query)
    {
        return $query->where('status', 'won');
    }

    /**
     * Scope a query to only include outbid bids
     */
    public function scopeOutbid($query)
    {
        return $query->where('status', 'outbid');
    }

    /**
     * Scope a query to only include lost bids
     */
    public function scopeLost($query)
    {
        return $query->where('status', 'lost');
    }
}
