<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSpecs extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_spec';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['product_id', 'spec_name', 'spec_value'];

    /**
     * The primary key associated with the table.
     *
     * @var string[]
     */
    protected $primaryKey = ['product_id', 'spec_name'];

    /**
     * Indicates if the primary key is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Get the product that owns the specification.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
