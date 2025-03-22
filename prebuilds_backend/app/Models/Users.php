<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Users extends Model
{
    use HasApiTokens, HasFactory; // Add HasApiTokens here

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_username',
        'user_firstname',
        'user_lastname',
        'user_phone',
        'user_country',
        'user_address',
        'user_email',
        'user_password',
        'user_role',
        'user_account_status',
        'user_registration_date',
        'user_last_logged_at',
    ];

    protected $hidden = [
        'user_password', // Hide password when retrieving user data
    ];

    /**
     * Hash the password before saving the user.
     *
     * @param string $value
     * @return void
     */
    public function setUserPasswordAttribute($value)
    {
        $this->attributes['user_password'] = Hash::make($value);
    }

    public $timestamps = false;
    /**
     * Set the last_logged_at timestamp.
     */
    public function setLastLoggedAtAttribute()
    {
        $this->attributes['last_logged_at'] = now();
    }
}
