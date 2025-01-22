<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\ProductSpecs;
use App\Models\Categories;
use App\Models\SubCategories;
use App\Models\GlobalSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ProductsController extends Controller {

    public function index() {

        
        $new_product_duration = GlobalSettings::first()->new_product_duration;

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

        return response()->json( ['products' =>$products, 'new_product_duration' => $new_product_duration] );
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
            'subcategory_id' => 'nullable|integer',
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

        if ( $request->buying_price > $request->selling_price || $request->discount_price >= $request->selling_price ) {
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

        if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
            $productsQuery = Products::where( 'product_visibility', '=', 'Visible' );
        } else {
            $productsQuery = Products::query();

        }

        if ( isset( $id ) ) {
            $productsQuery->where( 'product_id', '=', $id );
        }

        if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
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

        $specs =  ProductSpecs::where( 'product_id', $id )->get();

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

    public function update( Request $request, string $id ) {
        if ( session( 'user_role' ) !== 'Owner' && session( 'user_role' ) !== 'Admin' ) {
            return response()->json( [ 'databaseError' => 'Action Not Authorized. 01' ] );
        }

        $updatedProduct = Products::findOrFail( $id ) ;

        if ( !$updatedProduct ) {
            return response()->json( [ 'databaseError' => 'Category does not exist.' ] );

        }
        ;

        $customMessages = [
            'product_name.required' => 'Product Name is required.',
            'product_name.min' => 'Product Name must be contain at least 3 characters.',
            'product_name.max' => 'Product Name cannot not contain more than 100 characters.',
            'product_name.unique' => 'Product Name already exists, please try again.',
            'product_desc.max' => 'Product Description cannot not contain more than 1500 characters.'
        ];

        $validator = Validator::make( $request->all(), [
            'product_name' => 'required|string|min:3|max:100|unique:products,product_name,' . $id . ',product_id',
            'product_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'product_desc' => 'nullable|string|max:1500',
            'category_id' => 'required|integer',
        ], $customMessages );

        if ( $validator->fails() ) {
            $errorMessage = $validator->errors()->first();
            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }

        if ( $request->hasFile( 'product_picture' ) ) {
            $file = $request->file( 'product_picture' );

            $sanitizedProductName = preg_replace( '/[^A-Za-z0-9\-]/', '-', $request->product_name );

            // Generate a unique file name
            $filename = $sanitizedProductName . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Move the file to the public/images directory
            $destinationPath = public_path( 'images' );
            $file->move( $destinationPath, $filename );

            // Generate the public URL for the stored image
            $productPictureUrl = 'images/' . $filename;
        } else {
            $productPictureUrl = null;
        }

        if ( $request->buying_price > $request->selling_price || $request->discount_price >= $request->selling_price ) {
            return response()->json( [ 'databaseError' => 'Buying/Discount price cannot be higher than selling price.' ], 422 );
        }

        if ( $request->buying_price < 0 || $request->selling_price < 0 || $request->discount_price < 0 || $request->product_quantity < 0 ) {
            return response()->json( [ 'databaseError' => 'Quantity and Price fields cannot be less than 0.' ], 422 );
        }

        $specs = [];

        // Check if 'specs' is present in the request
        if ( $request->has( 'specs' ) ) {
            // Retrieve the specs value from the request
            $specsInput = $request->specs;

            // If specs is a JSON string, decode it into an array
            if ( is_string( $specsInput ) ) {
                $specs = json_decode( $specsInput, true );

                // Ensure that the decoded value is an array
                if ( !is_array( $specs ) ) {
                    return response()->json( [ 'databaseError' => 'Invalid specs format.' ], 422 );
                }
            } elseif ( is_array( $specsInput ) ) {
                // If it's already an array, just use it directly
                $specs = $specsInput;
            } else {
                // If the specs input is neither a string nor an array, return an error
                return response()->json(['databaseError' => 'Invalid specs format.'], 422);
            }
        }

        ProductSpecs::where('product_id', $updatedProduct->product_id)->delete();

        // Step 4: Insert the new specs (if any)
        if (!empty($specs)) {
            $specNames = [];


            foreach ( $specs as $spec ) {
                $specName = trim( $spec[ 'spec_name' ] );

                if ( in_array( $specName, $specNames ) ) {
                    return response()->json( [ 'databaseError' => 'A specification name is repeated twice, verify your specification inputs.' ], 422 );
                }

                // Add the spec name to the array to track it
                $specNames[] = $specName;
            }



            $specsData = array_map(function ($spec) use ($updatedProduct) {
                return [
                    'product_id' => $updatedProduct->product_id,
                    'spec_name' => trim($spec['spec_name']),
                    'spec_value' => trim($spec['spec_value']),
                ];
            }, $specs);

            // Insert the new specs data
            ProductSpecs::insert($specsData);
        }

        if ($productPictureUrl != null) {


            $currentPicture = $updatedProduct->product_picture;

            // Check if there is an existing picture and it's not the default one
                if ( $currentPicture && $currentPicture !== 'images/Default_Product_Picture.jpg' ) {
                    $currentPicturePath = public_path( $currentPicture );

                    // Delete the old picture from the directory if it exists
                    if ( file_exists( $currentPicturePath ) ) {
                        unlink( $currentPicturePath );
                    }
                }

                $updatedProduct->update( [
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

            } else {
                $updatedProduct->update( [
                    'product_name' => trim( $request->product_name ),
                    'category_id' => $request->category_id,
                    'subcategory_id' => $request->subcategory_id,
                    'product_quantity' => $request->product_quantity,
                    'buying_price' => $request->buying_price,
                    'selling_price' => $request->selling_price,
                    'discount_price' => $request->discount_price,
                    'product_visibility' => $request->product_visibility,
                    'product_desc' => trim( $request->product_desc ),
                ] );
            }

            return response()->json( [ 'successMessage' => 'Product Updated Successfully.', 'product_picture' => $updatedProduct->product_picture ], 201 );

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
            $new_product_duration = GlobalSettings::first()->new_product_duration;


            $TitleName = '';
            $products = [];
            $selectFields = [];
            $query = null;

            if ( $catsub == 'discountedProducts' ) {
                // Checking for discount products, aka discount price less than selling price but higher than 0
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
                        'date_created',
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
                    'date_created',
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

        if ( $id == 0 && session( 'user_id' ) == null || session( 'user_id' ) == 'Client' ) {
            return response()->json( [ 'databaseError' => 'Not Found' ], 400 );
        }

        // Handle category ( 'c' ) or subcategory ( 's' ) logic
        if ( $type === 'c' ) {
            // If category, filter by category ID
            $category = Categories::find( $id );
            if ( !$category ) {
                return response()->json( [ 'databaseError' => 'Not Found' ], 404 );
            }

            $TitleName = $category->category_name;

            // Filter products by the found category ID
            $products = $query->where( 'category_id', $id )
            ->select( $selectFields )
            ->get();
        } elseif ( $type === 's' ) {

            $subcategory = Subcategories::find( $id );
            if ( !$subcategory ) {
                return response()->json( [ 'databaseError' => 'Not Found' ], 404 );
            }

            $TitleName = $subcategory->subcategory_name;

            // Filter products by the found subcategory ID
            $products = $query->where( 'subcategory_id', $id )
            ->select( $selectFields )
            ->get();
        } else {
            return response()->json( [ 'databaseError' => 'Not Found' ], 400 );
        }

        return response()->json( [
            'products' => $products,
            'pageTitle' => $TitleName,
            'new_product_duration' => $new_product_duration

        ] );
    }

    public function newProductsFetching() {


        $products = [];
        $selectFields = [];
        $new_product_duration = GlobalSettings::first()->new_product_duration;

        $TitleName = 'Newest Products';

        // Determine query based on user role
        if ( session( 'user_role' ) == 'Client' || session( 'user_role' ) === null ) {
            $query = Products::where( 'product_visibility', '=', 'Visible' );
            $selectFields = [
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'date_created',
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

        // Fetch products and add a condition to check if they are new
        $products = $query
        ->select( $selectFields )
        ->whereRaw( 'TIMESTAMPDIFF(MINUTE, date_created, NOW()) <= ?', [ $new_product_duration ] )
        ->get();

        // Return the products along with the title
        return response()->json( [
            'products' => $products,
            'pageTitle' => $TitleName,
            'new_product_duration' => $new_product_duration
        ] );
    }

}