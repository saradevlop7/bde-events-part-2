<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingApiController extends Controller
{
    public function book(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Vérifier si l'étudiant a déjà réservé
        $alreadyBooked = Booking::where('user_id', $request->user()->id)
            ->where('event_id', $event->id)
            ->exists();

        if ($alreadyBooked) {
            return response()->json([
                'message' => 'Vous avez déjà réservé cet événement.'
            ], 400);
        }

        // Vérifier la capacité maximale
        $bookingsCount = $event->bookings()->count();

        if ($bookingsCount >= $event->max_capacity) {
            return response()->json([
                'message' => 'L’événement est complet.'
            ], 400);
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
            'ticket_code' => 'BDE-' . date('Y') . '-' . strtoupper(\Illuminate\Support\Str::random(5)),
        ]);

        return response()->json([
            'message' => 'Réservation effectuée avec succès.',
            'booking' => $booking
        ], 201);
    }
}
