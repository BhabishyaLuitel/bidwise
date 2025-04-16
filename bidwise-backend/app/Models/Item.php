<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'images',
        'starting_price',
        'current_bid',
        'user_id',
        'category',
        'end_time',
        'status',
        'total_bids',
    ];

    protected $casts = [
        'images' => 'array',
        'starting_price' => 'decimal:2',
        'current_bid' => 'decimal:2',
        'end_time' => 'datetime',
        'total_bids' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'starting_price',
        'current_bid',
        'end_time',
        'total_bids',
        'user_id',
        'created_at',
        'updated_at',
    ];

    protected $appends = [
        'startingPrice',
        'currentBid',
        'endTime',
        'totalBids',
        'sellerId',
        'createdAt',
        'updatedAt',
    ];

    /**
     * Get the user that owns the item
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the bids for the item
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Get the highest bid for the item
     */
    public function highestBid(): HasOne
    {
        return $this->hasOne(Bid::class)->ofMany('amount', 'max');
    }

    /**
     * Get the highest bidder for the item
     */
    public function highestBidder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'user_id')
            ->whereHas('bids', function ($query) {
                $query->where('item_id', $this->id)
                    ->where('amount', $this->current_bid);
            });
    }

    /**
     * Check if the item is still active
     */
    public function isActive(): bool
    {
        return $this->end_time > now() && $this->status === 'active';
    }

    /**
     * Check if the item has ended
     */
    public function hasEnded(): bool
    {
        return $this->end_time < now();
    }

    /**
     * Check if the item is ending soon (within 24 hours)
     */
    public function isEndingSoon(): bool
    {
        return $this->isActive() && $this->end_time->diffInHours(now()) <= 24;
    }

    /**
     * Get the next minimum bid amount
     */
    public function getNextMinimumBid(): float
    {
        return $this->current_bid + 1;
    }

    /**
     * Update the item's status based on its current state
     */
    public function updateStatus(): void
    {
        if ($this->hasEnded()) {
            $this->update(['status' => 'ended']);
        }
    }

    // Accessors for camelCase attributes
    public function getStartingPriceAttribute()
    {
        return (float) $this->attributes['starting_price'];
    }

    public function getCurrentBidAttribute()
    {
        return (float) $this->attributes['current_bid'];
    }

    public function getEndTimeAttribute()
    {
        return Carbon::parse($this->attributes['end_time']);
    }

    public function getTotalBidsAttribute()
    {
        return (int) $this->attributes['total_bids'];
    }

    public function getSellerIdAttribute()
    {
        return (int) $this->attributes['user_id'];
    }

    public function getCreatedAtAttribute()
    {
        return $this->attributes['created_at'];
    }

    public function getUpdatedAtAttribute()
    {
        return $this->attributes['updated_at'];
    }

    protected function serializeDate($date)
    {
        return $date instanceof Carbon ? $date->toIso8601String() : $date;
    }
} 