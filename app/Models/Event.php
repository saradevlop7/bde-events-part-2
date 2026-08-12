<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'location',
        'price',
        'max_capacity',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
