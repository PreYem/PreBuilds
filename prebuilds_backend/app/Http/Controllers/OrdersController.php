<?php
namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{

    public function __construct()
    {
        $this->activeStatuses    = array_keys(config('order_statuses.active'));
        $this->completedStatuses = array_keys(config('order_statuses.completed'));
        $user              = Auth::guard('sanctum')->user();

        if ($user) {
            $this->user_role = $user->user_role;
            $this->user_id   = $user->user_id;
        } else {
            $this->user_role = null;
            $this->user_id   = null;
        }
    }

    public function index()
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

        $ordersColumns = [
            'order_id',
            'order_date',
            'order_totalAmount',
            'order_shippingAddress',
            'order_status',
            'order_paymentMethod',
            'order_phoneNumber',
            'order_notes',
        ];

        $orderItemsColumns = [
            'orderItem_id',
            'order_id',
            'product_id',
            'orderitem_quantity',
            'orderitem_unitprice',
        ];

        $productsColumns = [
            'product_id',
            'product_name',
            'selling_price',
            'discount_price',
            'product_picture',
        ];

        $orders = Orders::select($ordersColumns)
            ->with(['orderItems' => function ($query) use ($orderItemsColumns, $productsColumns) {
                $query->select($orderItemsColumns)
                    ->with(['products' => function ($query) use ($productsColumns) {
                        $query->select($productsColumns);
                    }]);
            }])
            ->where('user_id', 2)           // Only fetch orders for the authenticated user
            ->orderBy('order_date', 'desc') // Order by latest
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function create()
    {

    }

    public function store(Request $request)
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

        $customErrorMessages = [
            'order_shippingAddress.required' => 'The shipping address is required.',
            'order_shippingAddress.min'      => 'The shipping address is too short.',
            'order_shippingAddress.max'      => 'The shipping address cannot exceed 150 characters.',
            'order_paymentMethod.required'   => 'Please select a payment method.',
            'order_paymentMethod.in'         => 'The selected payment method is invalid.',
            'order_phoneNumber.required'     => 'A phone number is required.',
            'order_phoneNumber.regex'        => 'The phone number format is invalid.',
            'order_notes.max'                => 'Notes cannot be longer than 500 characters.',
        ];

        $validator = Validator::make($request->all(), [
            'order_shippingAddress' => 'required|string|min:10|max:150',
            'order_paymentMethod'   => 'required|string|in:Cash on Delivery,Bank Transfer',
            'order_phoneNumber'     => 'required|string|regex:/^[\d\s\+\-\(\)]+$/',
            'order_notes'           => 'nullable|string|max:500',
        ], $customErrorMessages);

        if ($validator->fails()) {
            $errorMessage = $validator->errors()->first();
            return response()->json(['databaseError' => $errorMessage], 422);
        }

        $currentCartItems = ShoppingCart::where('user_id', $this->user_id)
            ->join('products', 'shopping_cart.product_id', '=', 'products.product_id')
            ->select('shopping_cart.product_id', 'shopping_cart.quantity', 'products.selling_price', 'products.discount_price', 'product_quantity')
            ->get();

        $order_totalAmount = 0; // Starting total amount at 0

        foreach ($currentCartItems as $singleCartItem) {
            // Fetching the price of each product
            // If the product is discounted, we take discount_price, else  we take selling_price

            $productPrice = $singleCartItem->discount_price > 0 ? $singleCartItem->discount_price : $singleCartItem->selling_price;

            // Getting the total amount
            // We use min() to check if the quantity in cart exceeds the quantity in stock, if yes then we take the stock quantity, else we keep the cart quantity
            $order_totalAmount += min($singleCartItem->quantity, $singleCartItem->product_quantity) * $productPrice;
        }

        $newOrder = Orders::create([
            'user_id'               => $this->user_id,
            'order_shippingAddress' => $request->order_shippingAddress,
            'order_paymentMethod'   => $request->order_paymentMethod,
            'order_phoneNumber'     => $request->order_phoneNumber,
            'order_notes'           => $request->order_notes,
            'order_totalAmount'     => $order_totalAmount,

        ]);

        ShoppingCart::where('user_id', $this->user_id)->delete();                 // Clearing a user's cart after sending an order
        $cartItemCount = ShoppingCart::where('user_id', $this->user_id)->count(); // Sending the current amount of items in the cart after a full clear, which should be 0

        $activeOrdersCount = Orders::where('user_id', $this->user_id)
            ->whereIn('order_status', $this->activeStatuses )
            ->count();

        return response()->json([
            'successMessage'    => 'Your order has been sent out.',
            'cartItemCount'     => $cartItemCount,
            'activeOrdersCount' => $activeOrdersCount,
        ], 201);

    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }

    public function countOrders()
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

    }
}
