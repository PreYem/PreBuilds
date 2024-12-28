<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';

    protected $primaryKey = 'category_id';

    
    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = ['category_name', 'category_description'];




    public $timestamps = false;
}
