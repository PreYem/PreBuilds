<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';

    protected $primaryKey = 'category_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = ['category_name', 'category_description', 'category_display_order'];

    protected $casts = [
        'category_id'            => 'integer',
        'category_display_order' => 'integer',
    ];
}
