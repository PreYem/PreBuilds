<?php

namespace App\Http\Controllers;
use App\Models\GlobalSettings;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class GlobalSettingsController extends Controller {
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
        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        // Fetch all columns from the first row in the GlobalSettings table
        $globalSettings = GlobalSettings::first();

        return response()->json( $globalSettings );
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
        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 02' ] );
        }

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

    public function update( Request $request ) {
        if ( $this->user_role !== 'Owner' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 03' ], 422 );
        }

        $newProductDuration = $request->new_product_duration;

        if ( $newProductDuration <= 0 ) {
            return response()->json( [ 'databaseError' => 'Product Duration must be above 0.' ], 422 );
        }

        $customMessages = [
            'new_product_duration.required' => 'New Product Duration is required.',
            'new_product_duration.integer' => 'New Product Duration must be an integer.'
        ];

        $validator = Validator::make( $request->all(), [
            'new_product_duration' => 'required|integer'
        ], $customMessages );

        if ( $validator->fails() ) {
            $errorMessage = $validator->errors()->first();
            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        // Retrieve the first and only record in the table
        $globalSettings = GlobalSettings::first();

        // If no record exists, create a new one
        if ( !$globalSettings ) {
            $globalSettings = new GlobalSettings();
        }

        // Update the new_product_duration
        $globalSettings->new_product_duration = $newProductDuration;
        $globalSettings->save();

        return response()->json( [ 'successMessage' => 'New Product Duration updated successfully.' ] );
    }

    /**
    * Remove the specified resource from storage.
    */

    public function destroy( string $id ) {
        //
    }
}
