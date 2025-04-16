<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use App\Models\Categories;
use App\Models\SubCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller {

    protected $user;

    public function __construct() {
        $user = Auth::guard( 'sanctum' )->user();

        if ( $user ) {
            $this->user_role = $user->user_role;
            $this->user_id = $user->user_id;
        } else {
            $this->user_role = null;
            $this->user_id = null;
        }
    }

    public function index() {

        if ( !in_array( $this->user_role, [ 'Owner',  'Admin' ] ) ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        $categories = Categories::select(
            'categories.category_id as category_id',
            'categories.category_name as category_name',
            'categories.category_description as category_description',
            'categories.category_display_order as category_display_order',
            DB::raw( 'COUNT(DISTINCT products.product_id) as product_count' ), // Ensure unique products
            DB::raw( 'COUNT(DISTINCT subcategories.subcategory_id) as subcategory_count' ) // Ensure unique subcategories
        )
        ->leftJoin( 'products', 'categories.category_id', '=', 'products.category_id' ) // Join with products table
        ->leftJoin( 'subcategories', 'categories.category_id', '=', 'subcategories.category_id' ) // Join with subcategories table
        ->groupBy(
            'categories.category_id',
            'categories.category_name',
            'categories.category_description',
            'category_display_order'
        )
        ->orderBy( 'category_display_order', 'asc' )
        ->get();

        return response()->json( $categories );
    }

    // Creating a new category

    public function store( Request $request ) {

        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 02' ] );
        }
        ;

        $validator = Validator::make( $request->all(), [
            'category_display_order' => 'nullable|integer',
            'category_name' => 'required|string|min:3|max:15|min:3|unique:categories,category_name',
            'category_description' => 'nullable|string|max:1500',
        ] );

        $maxTotalLength = 105;

        $totalCategoryNameLength = DB::table( 'categories' )
        ->where( 'category_name', '!=', 'Unspecified' )
        ->selectRaw( 'SUM(CHAR_LENGTH(category_name)) as total_length' )
        ->value( 'total_length' );

        if ( $totalCategoryNameLength + strlen( $request->category_name ) > $maxTotalLength ) {
            $errorMessage = "Character Limit for category names has been reached, please reconsider reducing the name length of 
                            this category or other registered categories to avoid Navigation Bar UI issues.";

            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        // Check if validation fails
        if ( $validator->fails() ) {
            $errors = $validator->errors();

            // Initialize error message variable
            $errorMessage = null;

            // Custom error handling for 'category_name'
            if ( !$errorMessage && $errors->has( 'category_name' ) ) {
                $categoryNameError = $errors->first( 'category_name' );
                if ( $categoryNameError === 'The category name has already been taken.' ) {
                    $errorMessage = 'Category name already exists, please choose another.';
                } elseif ( strlen( $request->input( 'category_name' ) ) > 20 ) {
                    $errorMessage = 'Category name is too long, please choose a name with less than 20 characters.';
                } elseif ( strlen( $request->input( 'category_name' ) ) < 3 ) {
                    $errorMessage = 'Category name is too short, please choose a name with at least 3 characters.';
                }
            }

            // Custom error handling for 'category_description'
            if ( !$errorMessage && $errors->has( 'category_description' ) ) {
                $errorMessage = 'Category description is too long, please limit it to 255 characters.';
            }

            // Return a single custom error message with HTTP status 422
            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        if ( $request->category_display_order === null ) {

            $categoryDisplayOrder = DB::table( 'categories' )->max( 'category_display_order' ) + 1;
        } else {
            $categoryDisplayOrder = $request->category_display_order;
        }

        // Create a new category if no conflict
        $newCategory = Categories::create( [
            'category_name' => trim( $request->category_name ),
            'category_description' => trim( $request->category_description ),
            'category_display_order' => $categoryDisplayOrder,
        ] );

        // Optionally store success message in session

        return response()->json( [ 'successMessage' => 'Category created successfully!', 'newCategory' => $newCategory ], 201 );
    }
    // Displaying categories as well as their related products

    public function show( $id ) {

        if ( $this->user_role !== 'Owner' && $this->user_role !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 03' ] );
        }
        $category = Categories::with( [ 'products' ] )->findOrFail( $id );

        return response()->json( $category );
    }
    // Updating/Editing a category based on its passed $id

    public function update( Request $request, $id ) {
        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 04' ] );
        }

        $validator = Validator::make( $request->all(), [
            'category_name' => 'required|string||max:15|min:3|unique:categories,category_name,' . $id . ',category_id',
            'category_description' => 'nullable|string|max:1500',
            'category_display_order' => 'nullable|integer',
        ] );

        $maxTotalLength = 105;

        $totalCategoryNameLength = DB::table( 'categories' )
        ->where( 'category_name', '!=', 'Unspecified' )
        ->selectRaw( 'SUM(CHAR_LENGTH(category_name)) as total_length' )
        ->value( 'total_length' );

        if ( $totalCategoryNameLength + strlen( $request->category_name ) > $maxTotalLength ) {
            $errorMessage = "Character Limit for category names has been reached, please reconsider reducing the name length of 
                            this category or other registered categories to avoid Navigation Bar UI issues.";

            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        if ( $validator->fails() ) {
            $errors = $validator->errors();
            $errorMessage = null;

            // Custom error handling for 'category_name'
            if ( $errors->has( 'category_name' ) ) {
                $categoryNameError = $errors->first( 'category_name' );
                if ( str_contains( $categoryNameError, 'has already been taken' ) ) {
                    $errorMessage = 'Category name already exists, please choose another.';
                } elseif ( strlen( $request->category_name ) > 20 ) {
                    $errorMessage = 'Category name is too long, please choose a name with less than 20 characters.';
                } elseif ( strlen( $request->category_name ) < 3 ) {
                    $errorMessage = 'Category name is too short, please choose a name with at least 3 characters.';
                }
            }

            // Custom error handling for 'category_description'
            if ( !$errorMessage && $errors->has( 'category_description' ) ) {
                $errorMessage = 'Category description is too long, please keep it at 1500 characters or less.';
            }

            // Return a single custom error message with HTTP status 422
            return response()->json( [ 'databaseError' => $errorMessage ?? $errors->first() ], 422 );
        }

        // Find the category or return a 404 response
        $updatedCategory = Categories::findOrFail( $id );

        // Update the category with validated data
        $updatedCategory->update( [
            'category_name' => trim( $request->category_name ),
            'category_description' => trim( $request->category_description ),
            'category_display_order' => trim( $request->category_display_order ?? $category->category_display_order ), // Keep existing display order if not provided
        ] );

        return response()->json( [
            'successMessage' => 'Category updated successfully!',
            'updatedCategory' => $updatedCategory
        ] );
    }

    public function destroy( $id ) {
        // Check for user authorization
        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 05' ], 403 );
        }

        $category = Categories::find( $id );
        if ( !$category ) {
            $response = [ 'databaseError' => 'Category not found!' ];
            $status = 404;
        } else {
            // Handle 'unspecified' category fallback
            $unspecifiedCategory = Categories::whereRaw( 'LOWER(category_name) = ?', [ 'unspecified' ] )->first();
            $unspecifiedCategoryId = $unspecifiedCategory ? $unspecifiedCategory->category_id : null;

            // Reassign related products and subcategories
            Products::where( 'category_id', $id )->update( [ 'category_id' => $unspecifiedCategoryId ] );
            SubCategories::where( 'category_id', $id )->update( [ 'category_id' => $unspecifiedCategoryId ] );

            // Attempt to delete the category
            if ( $category->delete() ) {
                $response = [ 'successMessage' => 'Category deleted successfully.' ];
                $status = 200;
            } else {
                $response = [ 'databaseError' => 'Unable to delete category.' ];
                $status = 500;
            }
        }

        // Return the consolidated response
        return response()->json( $response, $status ?? 200 );
    }

    public function NavBarCategories() {
        $categories = Categories::where( 'category_name', '!=', 'Unspecified' )
        ->select( 'category_id', 'category_name', 'category_display_order' ) // alias columns
        ->orderBy( 'category_display_order', 'asc' )         // Sort by category_id in ascending order
        ->orderBy( 'category_name', 'asc' )
        ->get();

        $subcategories = SubCategories::where( 'subcategory_name', '!=', 'Unspecified' )
        ->select( 'subcategory_id', 'subcategory_name', 'category_id', 'subcategory_display_order' )
        ->orderBy( 'subcategory_display_order', 'asc' )         // Sort by category_id in ascending order
        ->orderBy( 'subcategory_name', 'asc' )
        ->get();

        return response()->json( [
            'categories' => $categories,
            'subcategories' => $subcategories
        ] );
    }

}
