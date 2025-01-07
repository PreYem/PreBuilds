<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSpecs extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'spec_name', 'spec_value'];

    /**
     * Get the product that owns the spec.
     */
    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}

