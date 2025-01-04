<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Categories;
use App\Models\SubCategories;
use Illuminate\Http\Request;

class ProductsController extends Controller {
    /**
    * Display a listing of the resource.
    */

    public function index() {
        if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
            $products = Products::where( 'product_visibility', '=', 'Visible' )
            ->select(
                'product_id',
                'product_name',
                'category_id',
                'subcategory_id',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price'
            )
            ->get();
        } else {
            $products = Products::select(
                'product_id',
                'product_name',
                'category_id',
                'subcategory_id',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price',
                'date_created',
                'product_visibility'

            )
            ->get();
        }

        return response()->json( $products );
    }

    /**
    * Show the form for creating a new resource.
    */

    public function create() {
        if ( session('user_role') !== 'Owner' && session('user_role') !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
    }

    /**
    * Store a newly created resource in storage.
    */

    public function store( Request $request ) {
        if ( session('user_role') !== 'Owner' && session('user_role') !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
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
        if ( session('user_role') !== 'Owner' && session('user_role') !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
        //
    }

    /**
    * Update the specified resource in storage.
    */

    public function update( Request $request, string $id ) {
        if ( session('user_role') !== 'Owner' && session('user_role') !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
        //
    }

    /**
    * Remove the specified resource from storage.
    */

    public function destroy( string $id ) {
        if ( session('user_role') !== 'Owner' && session('user_role') !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        if ( session( 'user_role' ) === 'Owner' ||  session( 'user_role' ) === 'Admin' ) {
            $product_id = $id;
            $productExists = Products::find( $product_id );

            if ( $productExists ) {
                $productExists->delete();
                $messageDelete = 'Product Deleted Successfully.';
            } else {
                $messageDelete = 'Product Not Found.';
            }

        } else {
            $messageDelete = 'Action Not Authorized.';
        }

        return response()->json( $messageDelete );

    }







    public function NavBarFetching(string $catsub)
    {
        $TitleName = "";
        $categoryParts = explode('-', $catsub);
    
        if (count($categoryParts) !== 2) {
            return response()->json(['databaseError' => 'Invalid category format'], 400);
        }
    
        list($type, $id) = $categoryParts; // Get type ('c' or 's') and ID
    
        if (session('user_role') == 'Client' || session('user_role') === null) {
            $query = Products::where('product_visibility', '=', 'Visible');
            $selectFields = [
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price'
            ];
    
            // Get the IDs of "Unspecified" categories and subcategories
            $unspecifiedCategoryId = Categories::where('category_name', 'Unspecified')->value('category_id');
            $unspecifiedSubcategoryIds = Subcategories::where('subcategory_name', 'Unspecified')->pluck('subcategory_id')->toArray();
    
            // Add condition to exclude "Unspecified" categories or subcategories
            $query = $query->where(function ($q) use ($unspecifiedCategoryId, $unspecifiedSubcategoryIds) {
                if ($unspecifiedCategoryId) {
                    $q->where('category_id', '!=', $unspecifiedCategoryId);
                }
                if (!empty($unspecifiedSubcategoryIds)) {
                    $q->whereNotIn('subcategory_id', $unspecifiedSubcategoryIds);
                }
            });
        } else {
            $query = Products::query();
            $selectFields = [
                'product_id',
                'product_name',
                'category_id',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price',
                'date_created',
                'product_visibility'
            ];
        }
    
        if ($type === 'c') {
            // If category, filter by category ID
            $category = Categories::find($id);
            if (!$category) {
                return response()->json(['databaseError' => 'Category not found'], 404);
            } else {
                $TitleName = $category->category_name;
            }
    
            // Filter products by the found category ID and select the required fields
            $products = $query->where('category_id', $id)
                ->select($selectFields)
                ->get();
        } elseif ($type === 's') {
            // If subcategory, filter by subcategory ID
            $subcategory = Subcategories::find($id);
            if (!$subcategory) {
                return response()->json(['databaseError' => 'Subcategory not found'], 404);
            } else {
                $TitleName = $subcategory->subcategory_name;
            }
    
            // Filter products by the found subcategory ID and select the required fields
            $products = $query->where('subcategory_id', $id)
                ->select($selectFields)
                ->get();
        } else {
            return response()->json(['databaseError' => 'Invalid type'], 400);
        }
    
        return response()->json([
            'products' => $products,
            'pageTitle' => $TitleName
        ]);
    }
    
    

}
