<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

Broadcast::channel('item.{itemId}', function ($user, $itemId) {
    return true; // Allow all authenticated users to listen to item channels
}); 