<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    // Define the table name (Laravel assumes it is 'categories' but adding for clarity)
    protected $table = 'categories';

    // Define the primary key column name (if it's not the default 'id')
    protected $primaryKey = 'category_id';

    // If you're using auto-incrementing primary keys, you should set this to true (default is true)
    public $incrementing = true;

    // Set the key type to 'int' for auto-incrementing keys (default is 'int')
    protected $keyType = 'int';

    // Define which attributes are mass assignable
    protected $fillable = ['category_name', 'category_description', 'category_parent_id'];

    // Define relationships

    // A category may have a parent category
    public function parent()
    {
        return $this->belongsTo(Categories::class, 'category_parent_id');
    }

    // A category may have many child categories
    public function children()
    {
        return $this->hasMany(Categories::class, 'category_parent_id');
    }

    // Optionally, you can define the timestamps explicitly (default is to use created_at and updated_at)
    public $timestamps = true;
}
