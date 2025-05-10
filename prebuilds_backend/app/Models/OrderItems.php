<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $primaryKey = 'orderItem_id';

    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'orderItem_quantity',
        'orderItem_unitPrice',
    ];

    public function orders()
    {
        return $this->belongsTo(Orders::class, 'order_id', 'order_id');
    }

    public function products()
    {
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }
}
