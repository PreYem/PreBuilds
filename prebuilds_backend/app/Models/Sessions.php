<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sessions extends Model
{
    protected $table = 'sessions';  // Optional, since Laravel will assume 'sessions' by default

    protected $primaryKey = 'session_id'; // Explicitly set the primary key

    public $incrementing = false; // Since we use a custom session_id (bigint with auto-increment)

    protected $fillable = ['user_id', 'payload', 'last_activity'];

    protected $casts = [
        'last_activity' => 'datetime', // Cast to Carbon instance for easy date manipulation
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(Users::class, 'user_id');
    }
}
