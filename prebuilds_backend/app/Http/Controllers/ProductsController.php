<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\ProductSpecs;
use App\Models\Categories;
use App\Models\SubCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


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


        $customMessages = [
            "product_name.required" => "Product Name is required.",
            "product_name.min" => "Product Name must be be at least 3 characters long.",
            "product_name.max" => "Product Name cannot not contain more than 100 characters.",
            "product_name.unique" => "Product Name already exists, please try again.",
            "product_desc.max" => "Product Description cannot not contain more than 1500 characters."
        ];

        $validator = Validator::make($request->all(), [
            "product_name" => "required|string|min:3|max:100|unique:products,product_name",
            "product_picture" => "nullable|file|mimes:jpg,jpeg,png|max:2048",
            "product_desc" => "nullable|string|max:1500",
            "subcategory_id" => "required|integer",
        ],$customMessages);



        if ( $validator->fails() ) {
            // Gather the first error message
            $errorMessage = $validator->errors()->first();
            return response()->json( [ 'databaseError' => $errorMessage ], 422 );
        }


        $productPictureUrl = 'images/Default_Product_Picture.jpg';

    
        if ($request->hasFile('product_picture')) {
            $file = $request->file('product_picture');
            
            // Generate a unique file name
            $filename = str_replace([' ', '/'], '-', $request->product_name) . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Move the file to the public/images directory
            $destinationPath = public_path('images');
            $file->move($destinationPath, $filename);
    
            // Generate the public URL for the stored image
            $productPictureUrl = 'images/' . $filename;
        }

        if ($request->buying_price > $request->selling_price) {
            return response()->json( [ 'databaseError' => 'Buying price cannot be higher than selling price.' ], 422 );
        }



        $specs = [];
        if ($request->has('specs') && !empty($request->specs)) {
            $specs = json_decode($request->specs, true);
            if (!is_array($specs)) {
                return response()->json(['error' => 'Invalid specs format.'], 422);
            }
        }
        
        if (!empty($specs)) {
            $specNames = [];
            
            foreach ($specs as $spec) {
                $specName = trim($spec['spec_name']);
                
                if (in_array($specName, $specNames)) {
                    return response()->json(['databaseError' => 'A specification name is repeated twice, verify your specification inputs.'], 422);
                }
                
                // Add the spec name to the array to track it
                $specNames[] = $specName;
            }
        
            // Create the product only after ensuring there are no duplicate spec names
            $newProduct = Products::create([
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
        
            // Prepare the specs data for insertion
            $specsData = array_map(function ($spec) use ($newProduct) {
                return [
                    'product_id' => $newProduct->product_id,
                    'spec_name' => trim($spec['spec_name']),
                    'spec_value' => trim($spec['spec_value']),
                ];
            }, $specs);
        
            // Insert the specs into the ProductSpecs table
            ProductSpecs::insert($specsData);
        
            return response()->json(["successMessage" => "Product Added Successfully."], 201);
        }
        
        // If no specs provided, still allow product creation
        $newProduct = Products::create([
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
        
        return response()->json(["successMessage" => "Product Added Successfully."], 201);
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




    public function destroy(string $id) {
        if (session('user_role') !== 'Owner' && session('user_role') !== 'Admin') {
            return response()->json(['databaseError' => 'Action Not Authorized. 01']);
        }
    
        $productExists = Products::find($id);
    
        if ($productExists) {
            $imagePath = public_path($productExists->product_picture);
            $defaultPicturePath = public_path('images/Default_Product_Picture.jpg');
    
            $productExists->delete();
    
            if (file_exists($imagePath) && $imagePath !== $defaultPicturePath) {
                unlink($imagePath);
            }
    
            $messageDelete = 'Product Deleted Successfully.';
        } else {
            $messageDelete = 'Product Not Found.';
        }
    
        return response()->json($messageDelete);
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
