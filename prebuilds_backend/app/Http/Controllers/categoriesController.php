<?php

namespace App\Http\Controllers;

use App\Models\Categories;

class categoriesController extends Controller
{
    public function index()
    {
        // Fetch all categories from the database
        $categories = Categories::all();

        // Return the data as JSON
        return response()->json($categories);
    }
}
