<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use App\Models\SubCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class SubCategoriesController extends Controller {


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
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ], 403 );
        }

        $subcategories = SubCategories::select(
            'subcategories.subcategory_id as subcategory_id',
            'subcategories.subcategory_name as subcategory_name',
            'subcategories.subcategory_description as subcategory_description',
            'subcategories.subcategory_display_order as subcategory_display_order',
            'categories.category_id as parent_category_id',
            'categories.category_name as parent_category_name',
            DB::raw( 'COUNT(DISTINCT products.product_id) as product_count' ) // Count unique products
        )
        ->leftJoin( 'categories', 'categories.category_id', '=', 'subcategories.category_id' ) // Correct join with categories table
        ->leftJoin( 'products', 'subcategories.subcategory_id', '=', 'products.subcategory_id' ) // Join with products table
        ->groupBy(
            'subcategories.subcategory_id', // Group by subcategory_id
            'subcategories.subcategory_name', // Group by subcategory_name
            'subcategories.subcategory_description', // Group by subcategory_description
            'subcategories.subcategory_display_order', // Group by subcategory_display_order
            'categories.category_name', // Group by category_name ( parent category )
            'categories.category_id'
        )
        ->orderBy( 'subcategories.subcategory_id', 'asc' ) // Order by subcategory_display_order
        ->get();

        return response()->json( $subcategories );
    }

    public function create() {
        if ( !in_array( $this->user_role, [ 'Owner'] ) ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 02' ], 403 );
        }
    }

    public function store( Request $request ) {
        $errorMessage = '';

        if ( $this->user_role !== 'Owner' ) {
            $errorMessage = [ 'databaseError' => 'Action Not Authorized. 03' ];

        }

        $validator = Validator::make( $request->all(), [
            'subcategory_name' => 'required|string|min:3|max:30|min:3|unique:categories,category_name',
            'subcategory_description' => 'nullable|string|max:1500',
            'subcategory_display_order' => 'nullable|integer',
        ] );

        $totalSubCategoriesUnderOne = DB::table( 'subcategories' )
        ->where( 'category_id', $request->category_id )
        ->count( 'subcategory_id' );

        if ( $totalSubCategoriesUnderOne > 12 ) {
            $errorMessage = [ 'databaseError' => "You've reached the limit of 12 subcategories under this category." ];
        }

        if ( $validator->fails() ) {
            $errors = $validator->errors();

            // Initialize error message variable
            $errorMessage = null;

            // Custom error handling for 'category_name'
            if ( !$errorMessage && $errors->has( 'subcategory_name' ) ) {
                $categoryNameError = $errors->first( 'category_name' );
                if ( $categoryNameError === 'The category name has already been taken.' ) {
                    $errorMessage = [ 'databaseError' => 'Sub-Category name already exists, please choose another.' ];

                } elseif ( strlen( $request->input( 'subcategory_name' ) ) > 20 ) {
                    $errorMessage = [ 'databaseError' => 'Sub-Category name is too long, please choose a name between 3 and 30 characters.' ];

                } elseif ( strlen( $request->input( 'subcategory_name' ) ) < 3 ) {
                    $errorMessage = [ 'databaseError' => 'Category name is too short, please choose a name between 3 and 20 characters.' ];

                }
            }

            // Custom error handling for 'category_description'
            if ( !$errorMessage && $errors->has( 'subcategory_description' ) ) {
                $errorMessage = 'Sub-Category description is too long, please limit it to 255 characters.';
            }

            if ( $errorMessage != null ) {
                return response()->json( $errorMessage, 422 );
            }
        }

        if ( $request->subcategory_display_order === null ) {
            $subCategoryDisplayOrder = DB::table( 'subcategories' )
            ->where( 'category_id', $request->category_id ) // Add the WHERE clause
            ->max( 'subcategory_display_order' ) + 1;
        } else {
            $subCategoryDisplayOrder = $request->subcategory_display_order;
        }

        $newSubCategory = SubCategories::create( [
            'subcategory_name' => trim( $request->subcategory_name ),
            'subcategory_description' => trim( $request->subcategory_description ),
            'subcategory_display_order' => $subCategoryDisplayOrder,
            'category_id' => $request->category_id
        ] );

        return response()->json( [
            'successMessage' => 'Sub-Category created successfully!',
            'newSubCategory' => $newSubCategory
        ], 201 );
    }

    /**
    * Display the specified resource.
    */

    public function show( string $id ) {
        if ( !in_array( $this->user_role, [ 'Owner'] ) ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 04' ], 403 );
        }
    }

    /**
    * Show the form for editing the specified resource.
    */

    /**
    * Update the specified resource in storage.
    */

    public function update( Request $request, $id ) {

        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 05' ], 403 );
        }

        $validator = Validator::make( $request->all(), [
            'subcategory_name' => 'required|string||max:30|min:3|unique:subcategories,subcategory_name,' . $id . ',subcategory_id',
            'subcategory_description' => 'nullable|string|max:1500',
            'subcategory_display_order' => 'nullable|integer',
        ] );

        if ( $validator->fails() ) {
            $errors = $validator->errors();
            $errorMessage = null;

            // Custom error handling for 'category_name'
            if ( $errors->has( 'subcategory_name' ) ) {
                $subcategoryNameError = $errors->first( 'subcategory_name' );
                if ( str_contains( $subcategoryNameError, 'has already been taken' ) ) {
                    $errorMessage = 'Sub-Category name already exists, please choose another.';
                } elseif ( strlen( $request->subcategory_name ) > 20 ) {
                    $errorMessage = 'Sub-Category name is too long, please choose a name with less than 20 characters.';
                } elseif ( strlen( $request->subcategory_name ) < 3 ) {
                    $errorMessage = 'Sub-Category name is too short, please choose a name with at least 3 characters.';
                }
            }

            // Custom error handling for 'subcategory_description'
            if ( !$errorMessage && $errors->has( 'subcategory_description' ) ) {
                $errorMessage = 'Sub-Category description is too long, please keep it at 1500 characters or less.';
            }
            return response()->json( [ 'databaseError' => $errorMessage ?? $errors->first() ], 422 );
        }

        $updatedSubCategory = SubCategories::findOrFail( $id );

        $updatedSubCategory->update( [
            'subcategory_name' => trim( $request->subcategory_name ),
            'subcategory_description' => trim( $request->subcategory_description ),
            'subcategory_display_order' => $request->subcategory_display_order ?? $subcategory->subcategory_display_order, // Keep existing display order if not provided
            'category_id' => $request->parent_category_id
        ] );

        return response()->json( [
            'successMessage' => 'Sub-Category updated successfully!',
            'updatedSubCategory' => $updatedSubCategory
        ] );

    }

    public function destroy( $id ) {
        if ( $this->user_role !== 'Owner' || $this->user_id == null ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 06' ] );
        }

        $subCategory = SubCategories::find( $id );
        if ( !$subCategory ) {
            $response = [ 'databaseError' => 'Sub-Category not found!' ];
            $status = 404;
        } else {
            $unspecifiedSubCategory = SubCategories::whereRaw( 'LOWER(subcategory_name) = ?', [ 'unspecified' ] )->first();
            $unspecifiedSubCategoryId = $unspecifiedSubCategory ? $unspecifiedSubCategory->subcategory_id : null;

            Products::where( 'subcategory_id', $id )->update( [ 'subcategory_id' => $unspecifiedSubCategoryId ] );

            // Attempt to delete the category
            if ( $subCategory->delete() ) {
                $response = [ 'successMessage' => 'Sub-Category deleted successfully.' ];
                $status = 201;
            } else {
                $response = [ 'databaseError' => 'Unable to delete category.' ];
                $status = 400;
            }
        }

        return response()->json( $response, $status ?? 200 );

    }
}
