<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller {

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

        if ( $this->user_id == null ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ], 403 );
        }

        $shopping_cart = ShoppingCart::where( 'user_id', '=', $this->user_id )
        ->select(
            'cartItem_id',
            'user_id',
            'product_id',
            'quantity'
        )->get();

        return response()->json( [ 'ShoppingCart ' => $shopping_cart ] );

    }

    public function create() {

    }

    public function store( Request $request ) {
        if ( $this->user_id == null ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 02' ], 403 );
        }
        ;

        $product_quantity_in_stock = Products::where( 'product_id', $request->product_id )->pluck( 'product_quantity' )->first();

        $cartItem = ShoppingCart::where( 'user_id', $this->user_id )
        ->where( 'product_id', $request->product_id )
        ->first();

        if ( $cartItem ) {
            if ( $cartItem->quantity + $request->product_quantity <= $product_quantity_in_stock ) {
                $cartItem->increment( 'quantity', $request->product_quantity );
            } else {
                $cartItem->update( [ 'quantity' => $product_quantity_in_stock ] );
            }

        } else {
            ShoppingCart::create( [
                'user_id' => $this->user_id,
                'product_id' => $request->product_id,
                'quantity' => $request->product_quantity,
            ] );
        }

        $cartItemCount = ShoppingCart::where( 'user_id', $this->user_id )->count();

        return response()->json( [ 'successMessage' => 'Product Added to Cart', 'itemCartCount' =>  $cartItemCount ], 201 );

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

    public function cartItemCount() {
        if ( $this->user_id == null ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 03' ], 403 );
        }

        $cartItemCount = ShoppingCart::where( 'user_id', $this->user_id )->count();

        return response()->json( [ 'cartItemCount' => $cartItemCount ] );

    }
}
