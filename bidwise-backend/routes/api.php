<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\BidController;
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
});
