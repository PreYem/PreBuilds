<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalSettings extends Model
{
    use HasFactory;

    protected $table = 'global_settings';

    protected $primaryKey = null;

    public $incrementing = false;
    
    public $timestamps = false;
    // Define the fillable attributes
    protected $fillable = [
        'key',
        'value'
    ];

    

    // public function getNewProductDurationInDaysAttribute()
    // {
    //     return $this->new_product_duration / 1; // 1440 minutes in a day
    // }
}
