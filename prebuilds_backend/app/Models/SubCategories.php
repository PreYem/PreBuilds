<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubCategories extends Model
{
    protected $table = 'subcategories';

    protected $primaryKey = 'subcategory_id';

    public $incrementing = true;

    protected $keyType = 'int';
    public $timestamps = false;


    protected $fillable = ['subcategory_name', 'subcategory_description', 'subcategory_display_order' ,'category_id'];


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
