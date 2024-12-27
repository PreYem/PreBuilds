<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\SubCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class categoriesController extends Controller
{
    public function index()
    {
        // Fetch all categories and subcategories
        $categories = Categories::where('category_name', '!=', 'Unspecified')
            ->select('category_id', 'category_name')  // alias columns
            ->get();
    
    // Fetch only the id and name from SubCategories excluding "Unspecified", with aliasing
        $subcategories = SubCategories::where('subcategory_name', '!=', 'Unspecified')
            ->select('subcategory_id', 'subcategory_name','category_id')  // alias columns
            ->get();
    
        // Return them as a single response in a structured format (array)
        return response()->json([
            'categories' => $categories,
            'subcategories' => $subcategories
        ]);
    }
    




    public function getAllCategories() {
        $categories = Categories::select(
            'categories.category_id as category_id',
            'categories.category_name as category_name',
            'categories.category_description as category_description',
            DB::raw('COUNT(DISTINCT products.product_id) as product_count'), // Ensure unique products
            DB::raw('COUNT(DISTINCT subcategories.subcategory_id) as subcategory_count') // Ensure unique subcategories
        )
        ->leftJoin('products', 'categories.category_id', '=', 'products.category_id') // Join with products table
        ->leftJoin('subcategories', 'categories.category_id', '=', 'subcategories.category_id') // Join with subcategories table
        ->groupBy(
            'categories.category_id',
            'categories.category_name',
            'categories.category_description'
        )
        ->get();
    
        return response()->json($categories);
    }
    
    
    
    





    public function store(Request $request) // Creating a new category
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'category_description' => 'nullable|string',
            'category_parent_id' => 'nullable|exists:categories,category_id',
        ]);

        // Check if the category name already exists (case-insensitive)
        $categoryExists = Categories::whereRaw('LOWER(category_name) = ?', [strtolower($request->category_name)])->exists();

        if ($categoryExists) {
            // Store error in session
            session()->flash('errorMessage', 'A category with this name already exists.');

            // Return response with 409 Conflict
            return response()->json(['errorMessage' => 'A category with this name already exists.'], 409);
        }

        // Create a new category if no conflict
        $category = Categories::create([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_parent_id' => $request->category_parent_id,
        ]);

        // Optionally store success message in session
        session()->flash('successMessage', 'Category created successfully!');

        return response()->json(['successMessage' => 'Category created successfully!', 'category' => $category], 201);
    }





    public function show($id) // Displaying categories as well as their related products
    {
        $category = Categories::with(['products'])->findOrFail($id);

        return response()->json($category);
    }




    public function update(Request $request, $id) // Updating/Editing a category based on it's passed $id
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name,' . $id . ',category_id',
            'category_description' => 'nullable|string',
            'category_parent_id' => 'nullable|exists:categories,category_id',
        ]);

        $category = Categories::findOrFail($id);

        $category->update([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_parent_id' => $request->category_parent_id,
        ]);

        return response()->json(['message' => 'Category updated successfully!', 'category' => $category]);
    }


    public function destroy($id)
    {
        if (session('user_role') !== 'Owner' && session('user_role') !== 'Admin') {
            return response()->json(['userMessage' => 'Action Not Authorized.']);
        }
    
        $category = Categories::find($id);
        if (!$category) {
            return response()->json(['databaseError' => 'Category not found!'], 404);
        }
    
        $unspecifiedCategory = Categories::whereRaw('LOWER(category_name) = ?', ['unspecified'])->first();
        $unspecifiedCategoryId = $unspecifiedCategory ? $unspecifiedCategory->category_id : null;
            

        Products::where('category_id', $id)->update(['category_id' => $unspecifiedCategoryId]);
    
        // Update subcategories
        SubCategories::where('category_id', $id)->update(['category_id' => $unspecifiedCategoryId]);
    
        // Delete the category
        if ($category->delete()) {
            return response()->json(['successMessage' => 'Category deleted successfully.']);
        } else {
            return response()->json(['databaseError' => 'Unable to delete category.'], 500);
        }
    }
    
}
