<?php

namespace App\Events;

use App\Models\Bid;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $bid;

    public function __construct(Bid $bid)
    {
        $this->bid = $bid;
        $this->bid->load('user'); // Eager load user data
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('item.' . $this->bid->item_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'bid.placed';
    }

    public function broadcastWith(): array
    {
        return [
            'bid' => [
                'id' => $this->bid->id,
                'amount' => $this->bid->amount,
                'timestamp' => $this->bid->created_at,
                'user' => [
                    'id' => $this->bid->user->id,
                    'username' => $this->bid->user->username,
                ],
            ],
        ];
    }
} 