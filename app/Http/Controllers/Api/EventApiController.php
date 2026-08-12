<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventApiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'max_capacity' => 'required|integer|min:1',
        ]);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Événement créé avec succès',
            'event' => $event
        ], 201);
    }
    public function stats()
    {
        $events = Event::withCount('bookings')->get();
        return response()->json([
            "message" => "success",
            "event" => $events,
        ]);

    }
}
