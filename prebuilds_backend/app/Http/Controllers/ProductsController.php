<?php

namespace App\Http\Controllers;

use App\Models\Products;
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

}
