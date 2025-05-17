<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model {
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'order_totalAmount',
        'order_shippingAddress',
        'order_status',
        'order_paymentMethod',
        'order_phoneNumber',
        'order_notes',
        'user_id',
    ];

    public $timestamps = false;

    // Relationships

    public function user() {
        return $this->belongsTo( Users::class, 'user_id', 'user_id' );
    }

    public function orderItems() {
        return $this->hasMany( OrderItems::class, 'order_id', 'order_id' );
    }
}

