<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
class TicketApiController extends Controller
{
    public function index(Request $request)
    {
        $tickets = Booking::with('event')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'tickets' => $tickets->map(function ($booking) {
                return [
                    'ticket_code' => $booking->ticket_code,
                    'event_title' => $booking->event->title,
                    'date' => $booking->event->date,
                    'time' => $booking->event->time,
                    'location' => $booking->event->location,
                ];
            }),
        ]);
    }
}
