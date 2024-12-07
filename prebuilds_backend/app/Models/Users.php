<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'users';

    // The attributes that are mass assignable.
    protected $fillable = [
        'id', 
        'name', 
        'email', 
        'email_verified_at', 
        'password', 
        'remember_token', 
        'created_at', 
        'updated_at'
    ];



    // Timestamps are enabled by default.
    public $timestamps = true;
}