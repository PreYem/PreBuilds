<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use App\Models\Categories;
use App\Models\SubCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class categoriesController extends Controller
{

    




    public function index() {
        $categories = Categories::select(
            'categories.category_id as category_id',
            'categories.category_name as category_name',
            'categories.category_description as category_description',
            'categories.category_display_order as category_display_order',
            DB::raw('COUNT(DISTINCT products.product_id) as product_count'), // Ensure unique products
            DB::raw('COUNT(DISTINCT subcategories.subcategory_id) as subcategory_count') // Ensure unique subcategories
        )
        ->leftJoin('products', 'categories.category_id', '=', 'products.category_id') // Join with products table
        ->leftJoin('subcategories', 'categories.category_id', '=', 'subcategories.category_id') // Join with subcategories table
        ->groupBy(
            'categories.category_id',
            'categories.category_name',
            'categories.category_description',
            'category_display_order'
        )
        ->orderBy('category_display_order', 'asc')
        ->get();
    
        return response()->json($categories);
    }
    
    
    
    





    public function store(Request $request) // Creating a new category
    {
        $validator = Validator::make($request->all(), [
            'category_display_order' => 'integer',
            'category_name' => 'required|string|max:20|min:3|unique:categories,category_name',
            'category_description' => 'nullable|string',
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            $errors = $validator->errors();
    
            // Initialize error message variable
            $errorMessage = null;
    
            // Custom error handling for 'category_id'
            if ($errors->has('category_id')) {
                $categoryIdError = $errors->first('category_id');
                if ($categoryIdError === 'The category id must be an integer.') {
                    $errorMessage = 'Category ID must be a valid integer.';
                } elseif ($categoryIdError === 'The category id has already been taken.') {
                    $errorMessage = 'This category ID already exists, please choose another.';
                }
            }
    
            // Custom error handling for 'category_name'
            if (!$errorMessage && $errors->has('category_name')) {
                $categoryNameError = $errors->first('category_name');
                if ($categoryNameError === 'The category name has already been taken.') {
                    $errorMessage = 'Category name already exists, please choose another.';
                } elseif (strlen($request->input('category_name')) > 20) {
                    $errorMessage = 'Category name is too long, please choose a name with less than 20 characters.';
                } elseif (strlen($request->input('category_name')) < 3) {
                    $errorMessage = 'Category name is too short, please choose a name with at least 3 characters.';
                }
            }
    
            // Custom error handling for 'category_description'
            if (!$errorMessage && $errors->has('category_description')) {
                $errorMessage = 'Category description is too long, please limit it to 255 characters.';
            }
    
            // Return a single custom error message with HTTP status 422
            return response()->json(['databaseError' => $errorMessage], 422);
        }

        // Create a new category if no conflict
        $category = Categories::create([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_display_order' => $request->category_display_order,
        ]);

        // Optionally store success message in session

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


    public function NavBarCategories()
    {
        $categories = Categories::where('category_name', '!=', 'Unspecified')
            ->select('category_id', 'category_name') // alias columns
            ->orderBy('category_display_order', 'asc')         // Sort by category_id in ascending order
            ->orderBy('category_name', 'asc')
            ->get();
    
        $subcategories = SubCategories::where('subcategory_name', '!=', 'Unspecified')
            ->select('subcategory_id', 'subcategory_name', 'category_id')
            ->orderBy('subcategory_id', 'asc')     // Sort by subcategory_id in ascending order
            ->get();
    
        return response()->json([
            'categories' => $categories,
            'subcategories' => $subcategories
        ]);
    }
    
    
}
