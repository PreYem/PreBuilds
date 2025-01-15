<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\ProductSpecs;
use App\Models\Categories;
use App\Models\SubCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller {

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
                'product_visibility',
                'buying_price',
                'product_desc'
                

            )
            ->get();
        }

        return response()->json( $products );
    }

    /**
    * Show the form for creating a new resource.
    */

    public function create() {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
    }

    /**
    * Store a newly created resource in storage.
    */

    // public function store(Request $request) {
    //     \Log::info($request->all());

    // }

    public function store( Request $request ) {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        $customMessages = [
            'product_name.required' => 'Product Name is required.',
            'product_name.min' => 'Product Name must be be at least 3 characters long.',
            'product_name.max' => 'Product Name cannot not contain more than 100 characters.',
            'product_name.unique' => 'Product Name already exists, please try again.',
            'product_desc.max' => 'Product Description cannot not contain more than 1500 characters.'
        ];

        $validator = Validator::make( $request->all(), [
            'product_name' => 'required|string|min:3|max:100|unique:products,product_name',
            'product_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'product_desc' => 'nullable|string|max:1500',
            'subcategory_id' => 'required|integer',
        ], $customMessages );

        if ( $validator->fails() ) {
            // Gather the first error message
            $errorMessage = $validator->errors()->first();
            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        $productPictureUrl = 'images/Default_Product_Picture.jpg';

        if ( $request->hasFile( 'product_picture' ) ) {
            $file = $request->file( 'product_picture' );

            $sanitizedProductName = preg_replace( '/[^A-Za-z0-9\-]/', '-', $request->product_name );
            ;

            // Generate a unique file name
            $filename = $sanitizedProductName . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Move the file to the public/images directory
            $destinationPath = public_path( 'images' );
            $file->move( $destinationPath, $filename );

            // Generate the public URL for the stored image
            $productPictureUrl = 'images/' . $filename;
        }

        if ( $request->buying_price > $request->selling_price || $request->discount_price > $request->selling_price ) {
            return response()->json( [ 'databaseError' => 'Buying/Discount price cannot be higher than selling price.' ], 422 );
        }

        if ( $request->buying_price < 0 || $request->selling_price < 0 || $request->discount_price < 0 || $request->product_quantity < 0 ) {
            return response()->json( [ 'databaseError' => 'Quantity and Price fields cannot be less than 0.' ], 422 );
        }



        $specs = [];
        if ( $request->has( 'specs' ) && !empty( $request->specs ) ) {
            $specs = json_decode( $request->specs, true );
            if ( !is_array( $specs ) ) {
                return response()->json( [ 'error' => 'Invalid specs format.' ], 422 );
            }
        }

        if ( !empty( $specs ) ) {
            $specNames = [];

            foreach ( $specs as $spec ) {
                $specName = trim( $spec[ 'spec_name' ] );

                if ( in_array( $specName, $specNames ) ) {
                    return response()->json( [ 'databaseError' => 'A specification name is repeated twice, verify your specification inputs.' ], 422 );
                }

                // Add the spec name to the array to track it
                $specNames[] = $specName;
            }

            // Create the product only after ensuring there are no duplicate spec names
            $newProduct = Products::create( [
                'product_name' => trim( $request->product_name ),
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'product_quantity' => $request->product_quantity,
                'buying_price' => $request->buying_price,
                'selling_price' => $request->selling_price,
                'discount_price' => $request->discount_price,
                'product_picture' => $productPictureUrl,
                'product_visibility' => $request->product_visibility,
                'product_desc' => trim( $request->product_desc ),
            ] );

            // Prepare the specs data for insertion
            $specsData = array_map( function ( $spec ) use ( $newProduct ) {
                return [
                    'product_id' => $newProduct->product_id,
                    'spec_name' => trim( $spec[ 'spec_name' ] ),
                    'spec_value' => trim( $spec[ 'spec_value' ] ),
                ];
            }
            , $specs );

            // Insert the specs into the ProductSpecs table
            ProductSpecs::insert( $specsData );

            return response()->json( [ 'successMessage' => 'Product Added Successfully.' ], 201 );
        }

        // If no specs provided, still allow product creation
        $newProduct = Products::create( [
            'product_name' => trim( $request->product_name ),
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'product_quantity' => $request->product_quantity,
            'buying_price' => $request->buying_price,
            'selling_price' => $request->selling_price,
            'discount_price' => $request->discount_price,
            'product_picture' => $productPictureUrl,
            'product_visibility' => $request->product_visibility,
            'product_desc' => trim( $request->product_desc ),
        ] );

        return response()->json( [ 'successMessage' => 'Product Added Successfully.' ], 201 );
        
    }



    public function show( string $id ) {

        if (session('user_role') == 'Client' || session('user_role') === null) {
            $productsQuery = Products::where('product_visibility', '=', 'Visible');
        } else {
            $productsQuery = Products::query(); 
        }
        
        if (isset($id)) {
            $productsQuery->where('product_id', '=', $id);
        }
        
        if (session('user_role') == 'Client' || session('user_role') === null) {
            $productsQuery->select(
                'product_id',
                'product_name',
                'category_id',
                'subcategory_id',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price'
            );
        } else {
            $productsQuery->select(
                'product_id',
                'product_name',
                'category_id',
                'subcategory_id',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price',
                'date_created',
                'product_visibility',
                'product_desc'
            );
        }
        
        $product = $productsQuery->get();

        $specs =  ProductSpecs::where('product_id', $id)->get();



        return response()->json( [
            'product' => $product,
            'specs' => $specs
        ] );




    }

    /**
    * Show the form for editing the specified resource.
    */

    public function edit( string $id ) {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }
        //
    }





    public function updateS( Request $request, string $id ) {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        \Log::info($request->all());

        return response()->json( [ 'databaseError' => "errors logged" ], 200 );


    }


    

    public function update(Request $request, string $id) {
        // Authorization Check
        if (session('user_role') !== 'Owner' && session('user_role') !== 'Admin') {
            return response()->json(['databaseError' => 'Action Not Authorized. 01']);
        }
    
        // Find the product by ID
        $updatedProduct = Products::findOrFail($id);
        if (!$updatedProduct) {
            return response()->json(['databaseError' => 'Product does not exist.']);
        }
    
        // Custom Validation Messages
        $customMessages = [
            'product_name.required' => 'Product Name is required.',
            'product_name.min' => 'Product Name must contain at least 3 characters.',
            'product_name.max' => 'Product Name cannot contain more than 100 characters.',
            'product_name.unique' => 'Product Name already exists, please try again.',
            'product_desc.max' => 'Product Description cannot contain more than 1500 characters.',
        ];
    
        // Validate Request
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string|min:3|max:100|unique:products,product_name,' . $id . ',product_id',
            'product_desc' => 'nullable|string|max:1500',
            'category_id' => 'required|integer',
        ], $customMessages);
    
        if ($validator->fails()) {
            $errorMessage = $validator->errors()->first();
            return response()->json(['databaseError' => $errorMessage], 422);
        }
    
        // Handle the Product Picture
        $productPictureUrl = null;
    
        if ($request->has('product_picture') && !empty($request->product_picture)) {
            // Get the base64 string from the request
            $base64Image = $request->product_picture;
            
            // Split the base64 string to separate the data from the metadata
            $imageData = explode(',', $base64Image);
            
            // Default to 'jpg' if no extension is provided
            $fileExtension = 'jpg'; 
            
            if (count($imageData) > 1) {
                // Get the image type from the metadata
                $imageType = explode(';', $imageData[0])[0];
                if ($imageType == 'data:image/png') {
                    $fileExtension = 'png';
                } elseif ($imageType == 'data:image/jpeg') {
                    $fileExtension = 'jpg';
                }
    
                // Decode the base64 string
                $decodedImage = base64_decode($imageData[1]);
                
                // Sanitize the product name to use as the file name
                $sanitizedProductName = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->product_name);
                
                // Generate a unique filename
                $filename = $sanitizedProductName . '_' . uniqid() . '.' . $fileExtension;
    
                // Set the destination path for the file (use the public disk storage)
                $destinationPath = 'images/'; // Storage location
                
                // Log the file path for debugging
                Log::info('Saving image to: ' . $destinationPath . $filename);
    
                // Save the decoded image using the Storage facade
                if (Storage::disk('public')->put($destinationPath . $filename, $decodedImage)) {
                    // Generate the public URL for the image
                    $productPictureUrl = 'storage/' . $destinationPath . $filename;
                    Log::info('File saved successfully: ' . $productPictureUrl);
                } else {
                    // Log an error if the file saving failed
                    Log::error('Failed to save the file');
                }
            } else {
                // If the base64 data is invalid, set picture URL to null
                $productPictureUrl = null;
            }
        }
    
        // Validate prices
        if ($request->buying_price > $request->selling_price || $request->discount_price > $request->selling_price) {
            return response()->json(['databaseError' => 'Buying/Discount price cannot be higher than selling price.'], 422);
        }
    
        // Validate that prices and quantity are non-negative
        if ($request->buying_price < 0 || $request->selling_price < 0 || $request->discount_price < 0 || $request->product_quantity < 0) {
            return response()->json(['databaseError' => 'Quantity and Price fields cannot be less than 0.'], 422);
        }
    
        // Handle Specs (if present)
        $specs = [];
    
        if ($request->has('specs')) {
            $specsInput = $request->specs;
            
            if (is_string($specsInput)) {
                $specs = json_decode($specsInput, true);
                if (!is_array($specs)) {
                    return response()->json(['databaseError' => 'Invalid specs format.'], 422);
                }
            } elseif (is_array($specsInput)) {
                $specs = $specsInput;
            } else {
                return response()->json(['databaseError' => 'Invalid specs format.'], 422);
            }
        }
    
        // Delete previous specs
        ProductSpecs::where('product_id', $updatedProduct->product_id)->delete();
    
        // Insert new specs if any
        if (!empty($specs)) {
            $specNames = [];
            foreach ($specs as $spec) {
                $specName = trim($spec['spec_name']);
                if (in_array($specName, $specNames)) {
                    return response()->json(['databaseError' => 'A specification name is repeated twice, verify your specification inputs.'], 422);
                }
                $specNames[] = $specName;
            }
    
            $specsData = array_map(function ($spec) use ($updatedProduct) {
                return [
                    'product_id' => $updatedProduct->product_id,
                    'spec_name' => trim($spec['spec_name']),
                    'spec_value' => trim($spec['spec_value']),
                ];
            }, $specs);
    
            ProductSpecs::insert($specsData);
        }
    
        // Update the product with the new values
        if ($productPictureUrl != null) {
            $updatedProduct->update([
                'product_name' => trim($request->product_name),
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'product_quantity' => $request->product_quantity,
                'buying_price' => $request->buying_price,
                'selling_price' => $request->selling_price,
                'discount_price' => $request->discount_price,
                'product_picture' => $productPictureUrl,
                'product_visibility' => $request->product_visibility,
                'product_desc' => trim($request->product_desc),
            ]);
        } else {
            $updatedProduct->update([
                'product_name' => trim($request->product_name),
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'product_quantity' => $request->product_quantity,
                'buying_price' => $request->buying_price,
                'selling_price' => $request->selling_price,
                'discount_price' => $request->discount_price,
                'product_visibility' => $request->product_visibility,
                'product_desc' => trim($request->product_desc),
            ]);
        }
    
        // Return success message
        return response()->json(['successMessage' => 'Product Updated Successfully.'], 201);
    }




    public function destroy( string $id ) {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        $productExists = Products::find( $id );

        if ( $productExists ) {
            $imagePath = public_path( $productExists->product_picture );
            $defaultPicturePath = public_path( 'images/Default_Product_Picture.jpg' );

            $productExists->delete();

            if ( file_exists( $imagePath ) && $imagePath !== $defaultPicturePath ) {
                unlink( $imagePath );
            }

            $messageDelete = 'Product Deleted Successfully.';
        } else {
            $messageDelete = 'Product Not Found.';
        }

        return response()->json( $messageDelete );
    }

    public function NavBarFetching( string $catsub ) {
        $TitleName = '';
        $products = [];
        $selectFields = [];
        $query = null;

        
        if ( $catsub == 'discountedProducts' ) { // Checking for discount products, aka discount price less than selling price but higher than 0
            $TitleName = 'On Sale';

            // Determine query based on user role
            if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
                $query = Products::where( 'product_visibility', '=', 'Visible' );
                $selectFields = [
                    'product_id',
                    'product_name',
                    'selling_price',
                    'product_quantity',
                    'product_picture',
                    'discount_price'
                ];
            } else {
                $query = Products::query();
                $selectFields = [
                    'product_id',
                    'product_name',
                    'category_id',
                    'subcategory_id',
                    'selling_price',
                    'buying_price',
                    'product_quantity',
                    'product_picture',
                    'discount_price',
                    'date_created',
                    'product_visibility',
                    'product_desc'
                ];
            }

            // Filter products that have discount_price > 0 and less than selling_price
            $products = $query
            ->where( 'discount_price', '>', 0 )
            ->whereColumn( 'discount_price', '<', 'selling_price' )
            ->select( $selectFields )
            ->get();

            return response()->json( [
                'products' => $products,
                'pageTitle' => $TitleName
            ] );
        }

        // Otherwise, handle category/subcategory ( case for 'c' or 's' )
        $categoryParts = explode( '-', $catsub );

        // Ensure the category format is valid
        if ( count( $categoryParts ) !== 2 ) {
            return response()->json( [ 'databaseError' => 'Invalid category format' ], 400 );
        }

        list( $type, $id ) = $categoryParts;

        // Determine query based on user role for category/subcategory
        if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
            $query = Products::where( 'product_visibility', '=', 'Visible' );
            $selectFields = [
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price'
            ];

            // Exclude 'Unspecified' categories or subcategories
            $unspecifiedCategoryId = Categories::where( 'category_name', 'Unspecified' )->value( 'category_id' );
            $unspecifiedSubcategoryIds = Subcategories::where( 'subcategory_name', 'Unspecified' )->pluck( 'subcategory_id' )->toArray();

            $query = $query->where( function( $q ) use ( $unspecifiedCategoryId, $unspecifiedSubcategoryIds ) {
                if ( $unspecifiedCategoryId ) {
                    $q->where( 'category_id', '!=', $unspecifiedCategoryId );
                }
                if ( !empty( $unspecifiedSubcategoryIds ) ) {
                    $q->whereNotIn( 'subcategory_id', $unspecifiedSubcategoryIds );
                }
            }
        );
    } else {
        $query = Products::query();
        $selectFields = [
            'product_id',
            'product_name',
            'category_id',
            'buying_price',
            'selling_price',
            'product_quantity',
            'product_picture',
            'discount_price',
            'date_created',
            'product_visibility',
            'product_desc',
            'subcategory_id',
        ];
    }

    // Handle category ( 'c' ) or subcategory ( 's' ) logic
    if ( $type === 'c' ) {
        // If category, filter by category ID
        $category = Categories::find( $id );
        if ( !$category ) {
            return response()->json( [ 'databaseError' => 'Category not found' ], 404 );
        }

        $TitleName = $category->category_name;

        // Filter products by the found category ID
        $products = $query->where( 'category_id', $id )
        ->select( $selectFields )
        ->get();
    } elseif ( $type === 's' ) {
        // If subcategory, filter by subcategory ID
        $subcategory = Subcategories::find( $id );
        if ( !$subcategory ) {
            return response()->json( [ 'databaseError' => 'Subcategory not found' ], 404 );
        }

        $TitleName = $subcategory->subcategory_name;

        // Filter products by the found subcategory ID
        $products = $query->where( 'subcategory_id', $id )
        ->select( $selectFields )
        ->get();
    } else {
        return response()->json( [ 'databaseError' => 'Invalid URL Format' ], 400 );
    }

    return response()->json( [
        'products' => $products,
        'pageTitle' => $TitleName
    ] );
}

}