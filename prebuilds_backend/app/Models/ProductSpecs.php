<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSpecs extends Model {

    protected $table = 'product_specs';

    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'spec_name',
        'spec_value'
    ];

    protected $primaryKey = [
        'product_id',
        'spec_name'
    ];

    public function product() {
        return $this->belongsTo( Products::class, 'product_id' );
    }
}
