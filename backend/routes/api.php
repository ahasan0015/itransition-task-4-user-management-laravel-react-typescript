<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Global public endpoints for auth pipelines
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/verify/{token}', [UserController::class, 'verify'])->name('verification.verify');

Route::middleware(['auth:sanctum', 'check.status'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/bulk-action', [UserController::class, 'bulkAction']);
    Route::post('/logout', [UserController::class, 'logout']);
});