<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;


use App\Models\SubCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubCategoriesController extends Controller {
    /**
    * Display a listing of the resource.
    */

    public function index() {
        if (session('user_role') !== 'Owner' && session('user_role') !== 'Admin') {
            return response()->json([ 'databaseError' => 'Action Not Authorized. 01' ]);
        }
    
        $subcategories = SubCategories::select(
            'subcategories.subcategory_id as subcategory_id',
            'subcategories.subcategory_name as subcategory_name',
            'subcategories.subcategory_description as subcategory_description',
            'subcategories.subcategory_display_order as subcategory_display_order',
            'categories.category_name as parent_category_name',
            DB::raw('COUNT(DISTINCT products.product_id) as product_count') // Count unique products
        )
        ->leftJoin('categories', 'categories.category_id', '=', 'subcategories.category_id') // Correct join with categories table
        ->leftJoin('products', 'subcategories.subcategory_id', '=', 'products.subcategory_id') // Join with products table
        ->groupBy(
            'subcategories.subcategory_id', // Group by subcategory_id
            'subcategories.subcategory_name', // Group by subcategory_name
            'subcategories.subcategory_description', // Group by subcategory_description
            'subcategories.subcategory_display_order', // Group by subcategory_display_order
            'categories.category_name' // Group by category_name (parent category)
        )
        ->orderBy('subcategories.subcategory_display_order', 'asc') // Order by subcategory_display_order
        ->get();
        
        return response()->json($subcategories);
    }
    

    /**
    * Show the form for creating a new resource.
    */

    public function create() {
        //
    }

    /**
    * Store a newly created resource in storage.
    */

    public function store( Request $request ) {
        //
    }

    /**
    * Display the specified resource.
    */

    public function show( string $id ) {
        //
    }

    /**
    * Show the form for editing the specified resource.
    */

    public function edit( string $id ) {
        //
    }

    /**
    * Update the specified resource in storage.
    */

    public function update( Request $request, string $id ) {
        //
    }

    /**
    * Remove the specified resource from storage.
    */

    public function destroy( string $id ) {
        //
    }
}
