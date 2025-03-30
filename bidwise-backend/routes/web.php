<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Broadcasting\BroadcastManager;

Route::get('/', function () {
    return view('welcome');
});

// Route::post('register', [AuthController::class, 'register']);
// Route::post('login', [AuthController::class, 'login']);

// Broadcasting routes
Broadcast::routes(['middleware' => ['web', 'auth:sanctum']]);
