<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Public routes
Route::get('/items/featured', [ItemController::class, 'featured']);
Route::get('/items', [ItemController::class, 'index']);
Route::get('/items/{item}', [ItemController::class, 'show']);
Route::get('/users/{id}', [UserController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Item routes
    Route::post('/items', [ItemController::class, 'store']);
    Route::put('/items/{item}', [ItemController::class, 'update']);
    Route::delete('/items/{item}', [ItemController::class, 'destroy']);
    Route::get('/seller/items', [ItemController::class, 'sellerItems']);

    // Bid routes
    Route::get('/bids/user', [BidController::class, 'userBids']);
    Route::get('/bids/active', [BidController::class, 'activeBids']);
    Route::get('/bids/won', [BidController::class, 'wonBids']);
    Route::get('/bids/outbid', [BidController::class, 'outbidBids']);
    Route::get('/bids/lost', [BidController::class, 'lostBids']);
    Route::get('/items/{item}/bids', [BidController::class, 'index']);
    Route::post('/items/{item}/bids', [BidController::class, 'store']);
    Route::get('/bids/{bid}', [BidController::class, 'show']);
    Route::delete('/bids/{bid}', [BidController::class, 'destroy']);

    // User profile routes
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [UserController::class, 'updateProfile']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']);

    // Payment routes
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::post('/payments/{id}/setup-intent', [PaymentController::class, 'createPaymentIntent']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});

// Stripe webhook
Route::post('/webhook/stripe', [PaymentController::class, 'handleWebhook']);
