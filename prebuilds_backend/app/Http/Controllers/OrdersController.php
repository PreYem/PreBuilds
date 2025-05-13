<?php
namespace App\Http\Controllers;

use App\Models\GlobalSettings;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{

    public function __construct()
    {
        $this->activeStatuses    = array_keys(config('order_statuses.active'));
        $this->completedStatuses = array_keys(config('order_statuses.completed'));
        $user                    = Auth::guard('sanctum')->user();
        $setting                 = GlobalSettings::where('key', 'max_order_limit')->first();
        $this->max_order_limit   = $setting ? (int) $setting->value : 1;

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
            ->where('user_id', $this->user_id) // Only fetch orders for the authenticated user
            ->orderBy('order_date', 'desc')    // Order by latest
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

        $activeOrdersCount = Orders::where('user_id', $this->user_id)
            ->whereIn('order_status', $this->activeStatuses)
            ->count();

        if ($activeOrdersCount >= $this->max_order_limit) {
            return response()->json(['databaseError' => 'Unable to initiate order, you have too many pending orders.'], 403);

        }

        // This section is for verifying and validating user inputs | Yem
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

        // return an error message once an input error is detected | Yem
        if ($validator->fails()) {
            $errorMessage = $validator->errors()->first();
            return response()->json(['databaseError' => $errorMessage], 422);
        }

        // fetching what the user has in his shopping cart with a join on the products table for more details | Yem
        $currentCartItems = ShoppingCart::where('user_id', $this->user_id)
            ->join('products', 'shopping_cart.product_id', '=', 'products.product_id')
            ->select('shopping_cart.product_id', 'shopping_cart.quantity', 'products.selling_price', 'products.discount_price', 'product_quantity')
            ->get();

        // sending out an error in case the frontend fails and user was able to submit an order with an empty cart | Yem
        if ($currentCartItems->isEmpty()) {
            return response()->json(['databaseError' => 'Your cart is empty.'], 400);
        }

        $order_totalAmount = 0;  // Starting total amount at 0 | Yem
        $orderItemsData    = []; // This is for the purpose of preventing code duplication for calculating quantity of cart vs stock | Yem

        // this section is to fetch each item from the user's cart and deciding what the unit price would be | Yem
        // as well
        foreach ($currentCartItems as $item) {
            // we take price of unit as the discounted_price from products table if it's above 0, otherwise we take selling_price | Yem
            $price = $item->discount_price > 0 ? $item->discount_price : $item->selling_price;

            // we take a logical quantity in case a product's quantity changes while it's on the user's shopping cart | Yem
            $qty = min($item->quantity, $item->product_quantity);

            // getting a total amount for the order | Yem
            $order_totalAmount += $price * $qty;

            $orderItemsData[] = [
                'product_id'          => $item->product_id,
                'orderItem_quantity'  => $qty,
                'orderItem_unitPrice' => $price,
            ];
        }

        // Starting a transaction to make sure all data is inserted correctly or aborted entirely in case of an unknown issue mid-operation | Yem
        DB::beginTransaction();

        try {
            $newOrder = Orders::create([
                'user_id'               => $this->user_id,
                'order_shippingAddress' => $request->order_shippingAddress,
                'order_paymentMethod'   => $request->order_paymentMethod,
                'order_phoneNumber'     => $request->order_phoneNumber,
                'order_notes'           => $request->order_notes,
                'order_totalAmount'     => $order_totalAmount,

            ]);

            // Adding each product to the OrderItem table | Yem
            foreach ($orderItemsData as $item) {
                OrderItems::create([
                    'order_id'            => $newOrder->order_id,
                    'product_id'          => $item['product_id'],
                    'orderItem_quantity'  => $item['orderItem_quantity'],
                    'orderItem_unitPrice' => $item['orderItem_unitPrice'],
                ]);
            }
            // Clearing a user's cart after sending an order | Yem
            ShoppingCart::where('user_id', $this->user_id)->delete();
            // Sending the current amount of items in the cart after a full clear, which should be 0 | Yem
            $cartItemCount = ShoppingCart::where('user_id', $this->user_id)->count();

            $activeOrdersCount = Orders::where('user_id', $this->user_id)
                ->whereIn('order_status', $this->activeStatuses)
                ->count();

            DB::commit();

            return response()->json([
                'successMessage'    => 'Your order has been sent out.',
                'cartItemCount'     => $cartItemCount,
                'activeOrdersCount' => $activeOrdersCount,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            $error = $e->getMessage();
            return response()->json(['databaseError' => 'An unknown error prevented the system from submitting your order, please try again later.'], 500);
        }
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
