<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart;

class ShoppingCartController extends Controller {


    public function index() {
        if ( !in_array( session( "user_role" ), [ "Owner", "Admin", "Client" ] ) ) {
            return response()->json( [ "databaseError" => "Action Not Authorized. 01" ] );
        }

        if ( session( "user_id" ) == null ) {
            return response()->json( [ "databaseError" => "Action Not Authorized. 02" ] );
        }

        $shopping_cart = ShoppingCart::where( "user_id", "=", session( "user_id" ) )
        ->select(
            "cartItem_id",
            "user_id",
            "product_id",
            "quantity"
        )->get();

        return response()->json( ["ShoppingCart " => $shopping_cart] );

    }

    public function create() {

    }


    public function store( Request $request ) {
        if ( !in_array( session( "user_role" ), [ "Owner", "Admin", "Client" ] ) ) {
            return response()->json( [ "databaseError" => "Action Not Authorized. 01" ] );
        }
        ;

        if ( session( "user_id" ) == null ) {
            return response()->json( [ "databaseError" => "Action Not Authorized. 02" ] );
        }

        $user_id = session("user_id");
        $product_id = $request->product_id;
        $quantity = $request->quantity;

    }

    /**
    * Display the specified resource.
    */

    public function show( string $id ) {

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
