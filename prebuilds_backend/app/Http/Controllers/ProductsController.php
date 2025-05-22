<?php
namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\GlobalSettings;
use App\Models\OrderItems;
use App\Models\Products;
use App\Models\ProductSpecs;
use App\Models\SubCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductsController extends Controller
{

    public function __construct()
    {
        $user = Auth::guard('sanctum')->user();

        $setting              = GlobalSettings::where('key', 'new_product_duration')->first();
        $new_product_duration = $setting ? (int) $setting->value : 1;

        if ($user) {
            $this->user_role = $user->user_role;
            $this->user_id   = $user->user_id;
        } else {
            $this->user_role = null;
            $this->user_id   = null;
        }

                                                             // You can assign the $new_product_duration to a class property if needed
        $this->new_product_duration = $new_product_duration; // Store in class property if required
        $this->perPage              = 10;
    }

    public function index()
    {
        $new_product_duration = GlobalSettings::where('key', 'new_product_duration')->first();
        $defaultPicturePath   = 'Default_Product_Picture.jpg';
        $user                 = Auth::guard('sanctum')->user();

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            $productsQuery = Products::where('product_visibility', '=', 'Visible')
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
                ->orderBy('views', 'desc');
        } else {
            $productsQuery = Products::select(
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
                ->orderBy('views', 'desc');
        }

        $products = $productsQuery->paginate($this->perPage);

        // This should run every once in a while, will figure out how to schedule it later
        // This is for fixing products who randomly got their pictures removed
        foreach ($products as $product) {
            $imagePath = public_path($product->product_picture);

            if (! file_exists($imagePath) || empty($product->product_picture)) {
                $product->product_picture = $defaultPicturePath;

                Products::where('product_id', $product->product_id)->update([
                    'product_picture' => $defaultPicturePath,
                ]);
            }
        }

        return response()->json([
            'products'             => $products,
            'new_product_duration' => $this->new_product_duration,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);

        }
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 02'], 403);
        }

        $customMessages = [
            'product_name.required' => 'Product Name is required.',
            'product_name.min'      => 'Product Name must be at least 3 characters long.',
            'product_name.max'      => 'Product Name cannot contain more than 100 characters.',
            'product_name.unique'   => 'Product Name already exists, please try again.',
            'product_desc.max'      => 'Product Description cannot contain more than 1500 characters.',
        ];

        $validator = Validator::make($request->all(), [
            'product_name'    => 'required|string|min:3|max:100|unique:products,product_name',
            'product_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'product_desc'    => 'nullable|string|max:1500',
            'subcategory_id'  => 'nullable|integer',
        ], $customMessages);

        if ($validator->fails()) {
            return response()->json(['databaseError' => $validator->errors()->first()], 422);
        }

        // Starting a transaction
        try {
            DB::beginTransaction();

            // Creating the product
            $newProduct = Products::create([
                'product_name'       => trim($request->product_name),
                'category_id'        => $request->category_id,
                'subcategory_id'     => $request->subcategory_id,
                'product_quantity'   => $request->product_quantity,
                'buying_price'       => $request->buying_price,
                'selling_price'      => $request->selling_price,
                'discount_price'     => $request->discount_price,
                'product_picture'    => 'Default_Product_Picture.jpg',
                'product_visibility' => $request->product_visibility,
                'product_desc'       => trim($request->product_desc),
            ]);

            // Handling image upload
            if ($request->hasFile('product_picture')) {
                $file = $request->file('product_picture');

                $sanitizedProductName = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->product_name);
                $filename             = $newProduct->product_id . '_' . $sanitizedProductName . '.' . $file->getClientOriginalExtension();
                $destinationPath      = public_path('images');

                $file->move($destinationPath, $filename);

                $newProduct->update([
                    'product_picture' => 'images/' . $filename,
                ]);
            }

            // Handling product specs insertion after product creation
            if ($request->has('specs') && ! empty($request->specs)) {
                $specs = json_decode($request->specs, true);

                if (! is_array($specs)) {
                    DB::rollBack();
                    return response()->json(['databaseError' => 'Invalid specs format.'], 422);
                }

                $specNames = [];
                foreach ($specs as $spec) {
                    $specName = trim($spec['spec_name']);

                    if (in_array($specName, $specNames)) {
                        DB::rollBack();
                        return response()->json([
                            'databaseError' => 'A specification name is repeated twice, verify your specification inputs.',
                        ], 422);
                    }
                    $specNames[] = $specName;
                }

                $specsData = array_map(function ($spec) use ($newProduct) {
                    return [
                        'product_id' => $newProduct->product_id,
                        'spec_name'  => trim($spec['spec_name']),
                        'spec_value' => trim($spec['spec_value']),
                    ];
                }, $specs);

                ProductSpecs::insert($specsData);
            }

            DB::commit();

            return response()->json(['successMessage' => 'Product Added Successfully.'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['databaseError' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {

        $product = Products::find($id);

        if (! $product) {
            return response()->json(['databaseError' => "Product not found."], 404);
        }

        if (! in_array($this->user_role, ['Owner', 'Admin']) && $product->product_visibility !== "Visible") {
            return response()->json(['databaseError' => "Product not found."], 401);
        }

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            $product = Products::where('product_id', $id)
                ->where('product_visibility', 'Visible')
                ->select(
                    'product_id',
                    'product_name',
                    'product_desc',
                    'selling_price',
                    'product_quantity',
                    'product_picture',
                    'discount_price'
                )->first();
        } else {
            $product = Products::where('product_id', $id)
                ->select(
                    'product_id',
                    'category_id',
                    'subcategory_id',
                    'product_name',
                    'product_desc',
                    'selling_price',
                    'product_quantity',
                    'product_picture',
                    'discount_price',
                    'date_created',
                    'product_visibility',
                    'buying_price',
                    'views'
                )->first();
        }

        $product->increment('views');
        if ($product->count() > 0) {
            $specs = ProductSpecs::where('product_id', $id)->get();
        }

        return response()->json([
            'product' => $product,
            'specs'   => $specs,
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(string $id)
    {
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 03'], 403);
        }
        //
    }

    public function update(Request $request, string $id)
    {
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 04'], 403);
        }

        $updatedProduct = Products::findOrFail($id);

        $customMessages = [
            'product_name.required' => 'Product Name is required.',
            'product_name.min'      => 'Product Name must be contain at least 3 characters.',
            'product_name.max'      => 'Product Name cannot not contain more than 100 characters.',
            'product_name.unique'   => 'Product Name already exists, please try again.',
            'product_desc.max'      => 'Product Description cannot not contain more than 1500 characters.',
        ];

        $validator = Validator::make($request->all(), [
            'product_name'    => 'required|string|min:3|max:100|unique:products,product_name,' . $id . ',product_id',
            'product_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'product_desc'    => 'nullable|string|max:1500',
            'category_id'     => 'required|integer',
        ], $customMessages);

        if ($validator->fails()) {
            return response()->json(['databaseError' => $validator->errors()->first()], 422);
        }

        // Validate logical price constraints
        if ($request->buying_price > $request->selling_price || $request->discount_price >= $request->selling_price) {
            return response()->json(['databaseError' => 'Buying/Discount price cannot be higher than selling price.'], 422);
        }

        if ($request->buying_price < 0 || $request->selling_price < 0 || $request->discount_price < 0 || $request->product_quantity < 0) {
            return response()->json(['databaseError' => 'Quantity and Price fields cannot be less than 0.'], 422);
        }

        try {
            DB::beginTransaction();

            $productPictureUrl = null;

            if ($request->hasFile('product_picture')) {
                $file                 = $request->file('product_picture');
                $sanitizedProductName = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->product_name);
                $filename             = $updatedProduct->product_id . '-' . $sanitizedProductName . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $destinationPath      = public_path('images');
                $file->move($destinationPath, $filename);
                $productPictureUrl = 'images/' . $filename;
            }

            // Decode and validate specs
            $specs = [];
            if ($request->has('specs')) {
                $specsInput = $request->specs;
                if (is_string($specsInput)) {
                    $specs = json_decode($specsInput, true);
                    if (! is_array($specs)) {
                        DB::rollBack();
                        return response()->json(['databaseError' => 'Invalid specs format.'], 422);
                    }
                } elseif (is_array($specsInput)) {
                    $specs = $specsInput;
                } else {
                    DB::rollBack();
                    return response()->json(['databaseError' => 'Invalid specs format.'], 422);
                }
            }

            // Check for duplicate spec names
            $specNames = [];
            foreach ($specs as $spec) {
                $specName = trim($spec['spec_name']);
                if (in_array($specName, $specNames)) {
                    DB::rollBack();
                    return response()->json(['databaseError' => 'A specification name is repeated twice, verify your specification inputs.'], 422);
                }
                $specNames[] = $specName;
            }

            // Delete old specs
            ProductSpecs::where('product_id', $updatedProduct->product_id)->delete();

            // Insert new specs
            if (! empty($specs)) {
                $specsData = array_map(function ($spec) use ($updatedProduct) {
                    return [
                        'product_id' => $updatedProduct->product_id,
                        'spec_name'  => trim($spec['spec_name']),
                        'spec_value' => trim($spec['spec_value']),
                    ];
                }, $specs);

                ProductSpecs::insert($specsData);
            }

            // Handle old picture deletion (only after successful move)
            if ($productPictureUrl !== null) {
                $currentPicture = $updatedProduct->product_picture;
                if ($currentPicture && $currentPicture !== 'Default_Product_Picture.jpg') {
                    $currentPicturePath = public_path($currentPicture);
                    if (file_exists($currentPicturePath)) {
                        unlink($currentPicturePath);
                    }
                }
            }

            // Update product
            $updateData = [
                'product_name'       => trim($request->product_name),
                'category_id'        => $request->category_id,
                'subcategory_id'     => $request->subcategory_id,
                'product_quantity'   => $request->product_quantity,
                'buying_price'       => $request->buying_price,
                'selling_price'      => $request->selling_price,
                'discount_price'     => $request->discount_price,
                'product_visibility' => $request->product_visibility,
                'product_desc'       => trim($request->product_desc),
            ];

            if ($productPictureUrl !== null) {
                $updateData['product_picture'] = $productPictureUrl;
            }

            $updatedProduct->update($updateData);

            DB::commit();

            return response()->json([
                'successMessage'    => 'Product Updated Successfully.',
                'product_picture'   => $updatedProduct->product_picture,
                'product_visiblity' => $updatedProduct->product_visibility . " _ " . $request->product_visibility,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['databaseError' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 05'], 403);
        }

        $productExists = Products::find($id);

        $countOrdersContainingProduct = OrderItems::where('product_id', $id)
            ->distinct('order_id')
            ->count('order_id');

        if ($countOrdersContainingProduct > 0) {
            return response()->json([
                'databaseError' => "Error: Unable to delete this product as it exists in " . $countOrdersContainingProduct . " orders",
            ], 403);
        }

        if ($productExists) {
            $imagePath          = public_path($productExists->product_picture);
            $defaultPicturePath = public_path('Default_Product_Picture.jpg');

            $userCount = DB::table('shopping_cart')
                ->where('product_id', $id)
                ->distinct('user_id')
                ->count('user_id');

            $productExists->delete();

            if (file_exists($imagePath) && $imagePath !== $defaultPicturePath) {
                unlink($imagePath);
            }

            if ($userCount == 0) {
                return response()->json(['successMessage' => 'Product Deleted Successfully.'], 201);

            } else {
                return response()->json([
                    "warningMessage" => "The product has been permanently deleted and removed from the carts of " . $userCount . " user(s).",
                ], 201);

            }

        } else {
            return response()->json(['databaseError' => 'Product Not Found.'], 404);
        }

    }

    public function NavBarFetching(string $catsub)
    {
        $new_product_duration = GlobalSettings::where('key', 'new_product_duration')->first();

        $titleName    = '';
        $products     = [];
        $selectFields = [];
        $query        = null;

        if ($catsub === 'discountedProducts') {
            $titleName = 'On Sale';

            if (! $this->user_role || ! in_array($this->user_role, ['Owner', 'Admin'])) {
                $query        = Products::where('product_visibility', '=', 'Visible');
                $selectFields = [
                    'product_id',
                    'product_name',
                    'selling_price',
                    'product_quantity',
                    'product_picture',
                    'date_created',
                    'discount_price',
                ];
            } else {
                $query        = Products::query();
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
                    'product_desc',
                ];
            }

            $products = $query
                ->where('discount_price', '>', 0)
                ->whereColumn('discount_price', '<', 'selling_price')
                ->select($selectFields)
                ->orderBy('views', 'desc')
                ->paginate($this->perPage)
            ;

            return response()->json([
                'products'  => $products,
                'pageTitle' => $titleName,
            ]);
        }

        $categoryParts = explode('-', $catsub);

        if (count($categoryParts) !== 2) {
            return response()->json(['error' => 'Invalid category format'], 400);
        }

        list($type, $id) = $categoryParts;

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            $query        = Products::where('product_visibility', '=', 'Visible');
            $selectFields = [
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'date_created',
                'discount_price',
            ];

            $unspecifiedCategoryId     = Categories::where('category_name', 'Unspecified')->value('category_id');
            $unspecifiedSubcategoryIds = SubCategories::where('subcategory_name', 'Unspecified')->pluck('subcategory_id')->toArray();

            $query = $query->where(function ($q) use ($unspecifiedCategoryId, $unspecifiedSubcategoryIds) {
                if ($unspecifiedCategoryId) {
                    $q->where('category_id', '!=', $unspecifiedCategoryId);
                }

                if (! empty($unspecifiedSubcategoryIds)) {
                    $q->where(function ($q2) use ($unspecifiedSubcategoryIds) {
                        $q2->whereNotIn('subcategory_id', $unspecifiedSubcategoryIds)
                            ->orWhereNull('subcategory_id'); // ✅ allow products with no subcategory
                    });
                } else {
                    $q->orWhereNull('subcategory_id');
                }
            });
        } else {
            $query        = Products::query();
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

        if ($id == 0 && ! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Data Not Found'], 404);
        }

        if ($type === 'c') {
            $category = Categories::find($id);
            if (! $category) {
                return response()->json(['databaseError' => 'Data Not Found'], 404);
            }

            $titleName   = $category->category_name;
            $description = $category->category_description;

            $products = $query->where('category_id', $id)
                ->select($selectFields)
                ->orderBy('views', 'desc')
                ->paginate($this->perPage);

        } elseif ($type === 's') {
            $subcategory = SubCategories::find($id);
            if (! $subcategory) {
                return response()->json(['databaseError' => 'Not Found'], 404);
            }

            $titleName   = $subcategory->subcategory_name;
            $description = $subcategory->subcategory_description;

            $products = $query->where('subcategory_id', $id)
                ->select($selectFields)
                ->orderBy('views', 'desc')
                ->paginate($this->perPage);
        } else {
            return response()->json(['error' => 'Data Not Found'], 404);
        }

        return response()->json([
            'products'             => $products,
            'pageTitle'            => $titleName,
            'new_product_duration' => $new_product_duration?->value,
            'description'          => $description ?? null,
        ]);
    }

    public function newProductsFetching()
    {
        $products     = [];
        $selectFields = [];
        $titleName    = 'Newest Products';

        // Determine query based on user role
        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            $query        = Products::where('product_visibility', '=', 'Visible');
            $selectFields = [
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'date_created',
                'discount_price',
            ];
        } else {
            $query        = Products::query();
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
                'product_desc',
            ];
        }

        $products = $query
            ->select($selectFields)
            ->orderBy('views', 'desc')
            ->whereRaw('TIMESTAMPDIFF(MINUTE, date_created, NOW()) <= ?', [$this->new_product_duration])
            ->paginate($this->perPage);

        return response()->json([
            'products'             => $products,
            'pageTitle'            => $titleName,
            'new_product_duration' => $this->new_product_duration,
        ]);
    }

    public function SearchBar(string $keyWord)
    {
        $query = Products::where('product_name', 'like', '%' . $keyWord . '%')
            ->select(
                'product_id',
                'product_name',
                'selling_price',
                'product_quantity',
                'product_picture',
                'discount_price',
            );

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            $query->where('product_visibility', 'Visible');

        }

        $productsResult = $query->take(5)->get();

        if ($productsResult->isEmpty()) {
            return response()->json(['productsResult' => 'No Results Found.'], 404);
        }

        return response()->json(['productsResult' => $productsResult]);
    }

}
