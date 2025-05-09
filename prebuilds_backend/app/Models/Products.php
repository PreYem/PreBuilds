<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{

    protected $table = 'products';


    protected $primaryKey = 'product_id';


    public $timestamps = false;


    protected $fillable = [
        'product_name',
        'category_id',
        'subcategory_id',
        'product_desc',
        'buying_price',
        'selling_price',
        'product_quantity',
        'product_visibility',
        'date_created',
        'product_picture',
        'discount_price',
        'views'
    ];


    protected $attributes = [
        'product_visibility' => 'Visible',
        'discount_price' => 0.00,
    ];


    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id', 'category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(SubCategories::class, 'subcategory_id', 'subcategory_id');
    }


    public function getProductPictureAttribute($value)
    {
        return $value ?: 'images/default_product_picture.jpg';
    }

    public function specs()
    {
        return $this->hasMany(ProductSpecs::class);
    }

}
