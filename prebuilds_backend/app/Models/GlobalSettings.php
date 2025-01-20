<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalSettings extends Model
{
    use HasFactory;

    // Define the table name (optional if it follows convention)
    protected $table = 'global_settings';

    protected $primaryKey = null;

    public $incrementing = false;

    // Define the fillable attributes
    protected $fillable = [
        'new_product_duration',
    ];

    // Disable timestamps if you're not using them
    public $timestamps = false;

    // Optionally, add a getter for 'new_product_duration' to convert to more friendly units (e.g. days)
    public function getNewProductDurationInDaysAttribute()
    {
        return $this->new_product_duration / 1; // 1440 minutes in a day
    }
}
