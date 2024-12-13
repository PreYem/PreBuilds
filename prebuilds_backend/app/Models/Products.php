<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    // Specify the table name if it's not the plural form of the model name
    protected $table = 'products';

    // Define the primary key (if it’s different from the default 'id')
    protected $primaryKey = 'product_id';

    // Automatically manage timestamps
    public $timestamps = true;

    // Define the fillable attributes (columns you can mass-assign)
    protected $fillable = [
        'product_name',
        'category_id',
        'product_desc',
        'buying_price',
        'selling_price',
        'product_quantity',
        'product_visibility',
        'date_created',
        'product_picture',
        'discount_price',
    ];

    // You can specify default values in the model if needed, for example:
    protected $attributes = [
        'product_visibility' => 'Visible',  // default visibility
        'discount_price' => 0.00,  // default discount price
    ];

    // If you want to define a relationship (for example, with categories), you can do that here
    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id', 'category_id');
    }

    // Optionally, if you want to use a default picture when the product_picture is empty
    public function getProductPictureAttribute($value)
    {
        return $value ?: 'images/default_product_picture.jpg';  // Set the default image path if empty
    }
}
