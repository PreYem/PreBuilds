<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class categoriesController extends Controller
{
    public function index() // This is for fetching data into the nav, while excluding the "Unspecified" Category which is the default value.
    {
        $categories = Categories::where('category_name', '!=', 'Unspecified')->get();
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
        $category = Categories::findOrFail($id);


        $unspecified = Categories::where('category_name', 'Unspecified')->firstOrFail();


        $category->products()->update(['category_id' => $unspecified->category_id]);


        $category->delete();

        return response()->json(['message' => 'Category deleted successfully, products reassigned to Unspecified.']);
    }
}
