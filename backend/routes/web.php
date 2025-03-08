<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;

// User Registration & Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Auction Listing & Management Routes
Route::get('/auctions', [AuctionController::class, 'index']);
Route::get('/auctions/{id}', [AuctionController::class, 'show']);
Route::post('/auctions', [AuctionController::class, 'store']);
Route::put('/auctions/{id}', [AuctionController::class, 'update']);
Route::delete('/auctions/{id}', [AuctionController::class, 'destroy']);

// Bidding Routes
Route::post('/auctions/{id}/bid', [AuctionController::class, 'placeBid']);

// Notification Routes
Route::get('/notifications', [NotificationController::class, 'index']);

// Messaging System Routes
Route::post('/messages', [MessageController::class, 'send']);
Route::get('/messages/{auctionId}', [MessageController::class, 'getMessages']);