<?php
namespace App\Http\Controllers;

use App\Mail\OrderStatusMail;
use App\Models\GlobalSettings;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\ShoppingCart;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{

    public function __construct()
    {
        $this->activeStatuses    = config('order_statuses.active');
        $this->completedStatuses = config('order_statuses.completed');
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

        $usersColumns = [
            'user_id',
            'user_firstname',
            'user_lastname',
        ];

        // Base query
        $baseQuery = Orders::select($ordersColumns)
            ->with(['orderItems' => function ($query) use ($orderItemsColumns, $productsColumns) {
                $query->select($orderItemsColumns)
                    ->with(['products' => function ($query) use ($productsColumns) {
                        $query->select($productsColumns);
                    }]);
            }])
            ->where('user_id', $this->user_id);

        // Active orders
        $activeOrders = (clone $baseQuery)
            ->whereIn('order_status', array_keys($this->activeStatuses))
            ->orderBy('order_lastUpdated', 'desc')
            ->get();

        // Completed orders
        $completedOrders = (clone $baseQuery)
            ->whereIn('order_status', array_keys($this->completedStatuses))
            ->orderBy('order_lastUpdated', 'desc')
            ->get(5);

        return response()->json([
            'activeOrders'      => $activeOrders,
            'completedOrders'   => $completedOrders,
            'activeStatuses'    => $this->activeStatuses,
            'completedStatuses' => $this->completedStatuses,
        ]);
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

        // Validation rules and custom error messages
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

        // Fetch current cart items with product details
        $currentCartItems = ShoppingCart::where('user_id', $this->user_id)
            ->join('products', 'shopping_cart.product_id', '=', 'products.product_id')
            ->select(
                'shopping_cart.product_id',
                'shopping_cart.quantity',
                'products.selling_price',
                'products.discount_price',
                'products.product_quantity'
            )
            ->get();

        if ($currentCartItems->isEmpty()) {
            return response()->json(['databaseError' => 'Your cart is empty.'], 400);
        }

        // Begin transaction for atomic operation
        DB::beginTransaction();

        try {
            $order_totalAmount = 0;
            $orderItemsData    = [];

            // Lock product rows and verify stock
            foreach ($currentCartItems as $item) {
                // Lock product for update to prevent race conditions
                $product = Products::where('product_id', $item->product_id)->lockForUpdate()->first();

                if (! $product) {
                    DB::rollBack();
                    return response()->json(['databaseError' => "Product ID {$item->product_id} not found."], 404);
                }

                // Calculate allowed quantity (minimum of cart quantity and available stock)
                $qty = min($item->quantity, $product->product_quantity);

                if ($qty <= 0) {
                    DB::rollBack();
                    return response()->json(['databaseError' => $product->product_name . " is out of stock."], 400);
                }

                $price = $product->discount_price > 0 ? $product->discount_price : $product->selling_price;

                $order_totalAmount += $price * $qty;

                $orderItemsData[] = [
                    'product_id'          => $product->product_id,
                    'orderItem_quantity'  => $qty,
                    'orderItem_unitPrice' => $price,
                ];
            }

            if (empty($orderItemsData)) {
                DB::rollBack();
                return response()->json(['databaseError' => 'Cannot create an order with empty items.'], 400);
            }

            // Decrement stock now that all checks passed
            foreach ($orderItemsData as $item) {
                Products::where('product_id', $item['product_id'])->decrement('product_quantity', $item['orderItem_quantity']);
            }

            // Create the order
            $newOrder = Orders::create([
                'user_id'               => $this->user_id,
                'order_shippingAddress' => $request->order_shippingAddress,
                'order_paymentMethod'   => $request->order_paymentMethod,
                'order_phoneNumber'     => $request->order_phoneNumber,
                'order_notes'           => $request->order_notes,
                'order_totalAmount'     => $order_totalAmount,
            ]);
            $newOrder->refresh();

            // Create order items
            foreach ($orderItemsData as $item) {
                OrderItems::create([
                    'order_id'            => $newOrder->order_id,
                    'product_id'          => $item['product_id'],
                    'orderItem_quantity'  => $item['orderItem_quantity'],
                    'orderItem_unitPrice' => $item['orderItem_unitPrice'],
                ]);
            }

            // Clear shopping cart
            ShoppingCart::where('user_id', $this->user_id)->delete();

            // Count cart items (should be zero now)
            $cartItemCount = ShoppingCart::where('user_id', $this->user_id)->count();

            // Count active orders again
            $activeOrdersCount = Orders::where('user_id', $this->user_id)
                ->whereIn('order_status', $this->activeStatuses)
                ->count();

            $user = Users::select('user_firstname', 'user_email')->where('user_id', $this->user_id)->first();

            Mail::to($user->user_email)->send(new OrderStatusMail(
                $newOrder->order_status,                       // string $order_status
                (string) $newOrder->order_id,                  // string $order_id — cast to string just in case
                $user->user_firstname,                         // string $user_firstname
                'initiated',                                   // string $type
                (string) $newOrder->order_totalAmount . " Dhs" // string $order_totalAmount (with currency)
            ));

            DB::commit();

            return response()->json([
                'successMessage'    => 'Your order has been sent out.',
                'cartItemCount'     => $cartItemCount,
                'activeOrdersCount' => $activeOrdersCount,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'databaseError' => $e->getMessage() . " exception",
            ], 500);
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

    }

    public function UserCancelOrder(string $order_id)
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 401);
        }

        $order = Orders::where('order_id', $order_id)->firstOrFail();

        if ($this->user_id === $order->user_id) {

            if ($order->order_status === "Pending") {
                // Fetch order items related to this order
                $orderItems = OrderItems::where('order_id', $order->order_id)->get();

                // Restore quantities
                foreach ($orderItems as $item) {
                    Products::where('product_id', $item->product_id)
                        ->increment('product_quantity', $item->orderItem_quantity);
                }

                $order->order_status = 'Cancelled by User';
                $order->save();

                $user = Users::select('user_firstname', 'user_email')->where('user_id', $this->user_id)->first();

                Mail::to($user->user_email)->send(new OrderStatusMail(
                    $order->order_status,                       // string $order_status
                    (string) $order->order_id,                  // string $order_id — cast to string just in case
                    $user->user_firstname,                      // string $user_firstname
                    'Updated',                                  // string $type
                    (string) $order->order_totalAmount . " Dhs" // string $order_totalAmount (with currency)
                ));

                return response()->json(['successMessage' => 'Your order has been cancelled.'], 200);
            } else {
                return response()->json(['databaseError' => 'Unable to cancel order, please contact management.'], 404);
            }

        } else {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 401);
        }
    }

    public function fetchAdminOrders(string $status)
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 401);
        }

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

        if (! in_array($status, ['active', 'completed'])) {
            return response()->json(['databaseError' => 'Error retrieving data.'], 400);

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
            'user_id',
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

        $usersColumns = [
            'user_id',
            'user_firstname',
            'user_lastname',
        ];

        $baseQuery = Orders::select($ordersColumns)
            ->with([
                'orderItems' => function ($query) use ($orderItemsColumns, $productsColumns) {
                    $query->select($orderItemsColumns)
                        ->with(['products' => function ($query) use ($productsColumns) {
                            $query->select($productsColumns);
                        }]);
                },
                'user'       => function ($query) use ($usersColumns) {
                    $query->select($usersColumns);
                },
            ]);

        $statusList = $status === "active" ? array_keys($this->activeStatuses) : array_keys($this->completedStatuses);

        $orders = (clone $baseQuery)
            ->whereIn('order_status', $statusList)
            ->orderBy('order_lastUpdated', 'desc')
            ->get();

        return response()->json([
            'orders'            => $orders,
            'activeStatuses'    => $this->activeStatuses,
            'completedStatuses' => $this->completedStatuses,
        ]);

    }

    public function updateOrder(Request $request)
    {
        if ($this->user_id == null) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 401);
        }

        if (! in_array($this->user_role, ['Owner', 'Admin'])) {
            return response()->json(['databaseError' => 'Action Not Authorized. 01'], 403);
        }

        $newStatus = trim($request->order_status);

        // Load your config statuses here for clarity
        $activeStatuses    = array_keys(config('order_statuses.active'));
        $completedStatuses = array_keys(config('order_statuses.completed'));

        // Admin cannot modify completed orders at all
        if ($this->user_role === "Admin" && in_array($newStatus, $completedStatuses)) {
            return response()->json(['databaseError' => "Unable to modify order status as it's already marked as completed."], 403);
        }

        $orderToUpdate = Orders::findOrFail($request->order_id);

        if (! $orderToUpdate) {
            return response()->json(['databaseError' => 'Unable to find the order, please refresh and try again.'], 403);
        }

        // If status is not valid, reject
        if (! in_array($newStatus, $activeStatuses) && ! in_array($newStatus, $completedStatuses)) {
            return response()->json(['databaseError' => 'Invalid order status provided.'], 422);
        }

        // Exclude Pending from update as you mentioned
        if ($newStatus === 'Pending') {
            return response()->json(['databaseError' => 'Cannot set order status back to Pending.'], 422);
        }

        // Check if we are moving to a cancellation/refund type completed status that needs to restore quantity
        $statusesToRestoreQuantity = [
            'Cancelled by Management',
            'Cancelled by User',
            'Refunded',
            'Failed',
            'Returned',
        ];

        // If changing to a cancel/refund completed status AND the order was previously active (quantity was decremented)
        if (in_array($newStatus, $statusesToRestoreQuantity) && in_array($orderToUpdate->order_status, $activeStatuses)) {
            // Fetch order items
            $orderItems = OrderItems::where('order_id', $orderToUpdate->order_id)->get();

            foreach ($orderItems as $item) {
                Products::where('product_id', $item->product_id)
                    ->increment('product_quantity', $item->orderItem_quantity);
            }
        }

        // Update the order status
        $orderToUpdate->order_status = $newStatus;
        $orderToUpdate->save();

        $user = Users::select('user_firstname', 'user_email')->where('user_id', $orderToUpdate->user_id)->first();

        Mail::to($user->user_email)->send(new OrderStatusMail(
            $orderToUpdate->order_status,                       // string $order_status
            (string) $orderToUpdate->order_id,                  // string $order_id — cast to string just in case
            $user->user_firstname,                              // string $user_firstname
            'Updated',                                          // string $type
            (string) $orderToUpdate->order_totalAmount . " Dhs" // string $order_totalAmount (with currency)
        ));

        return response()->json(['successMessage' => "Order has been updated to {$newStatus}."]);
    }

}
