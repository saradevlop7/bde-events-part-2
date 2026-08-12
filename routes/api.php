<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\BookingApiController;

Route::post('/events/{id}/book', [BookingApiController::class, 'book'])
    ->middleware('auth:sanctum');
Route::post('/login', [AuthApiController::class, 'login']);

Route::post('/events', [EventApiController::class, 'store']);

Route::get('/admin/events/stats', [EventApiController::class, 'stats'])
    ->middleware(['auth:sanctum', 'isAdmin']);

Route::get('/user/tickets', [TicketApiController::class, 'index'])
    ->middleware('auth:sanctum');

