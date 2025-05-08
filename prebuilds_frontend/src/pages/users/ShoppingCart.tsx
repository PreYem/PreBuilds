import { useEffect, useState } from "react";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import { useNotification } from "../../context/GlobalNotificationContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../api/apiConfig";
import { useCart } from "../../context/CartItemCountContext";
import { PriceFormat } from "../../utils/PriceFormat";
import { truncateText } from "../../utils/TruncateText";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

interface CartTypes {
  cartItem_id: number;
  quantity: number;
  product_id: number;
  product_name: string;
  product_picture: string;
  discount_price: number;
  selling_price: number;
}

const ShoppingCart = ({ title }: TitleType) => {
  setTitle(title);
  const { showNotification } = useNotification();
  useRoleRedirect(["Owner", "Admin", "Client"]);
  const [cartItems, setCartItems] = useState<CartTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCartItemCount } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/shopping_cart");

        setCartItems(response.data.cartItems);
        setCartItemCount(response.data.cartItems.length);
      } catch (error) {
        showNotification("Internal Server Error", "databaseError");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const deleteCartItem = async (cartItemToDelete?: number) => {
    if (cartItemToDelete) {
      setCartItems((prevCartItems) => prevCartItems.filter((cartItem) => cartItem.cartItem_id !== cartItemToDelete)); // Delete item from the UI

      try {
        const response = await apiService.delete(`/api/shopping_cart/${cartItemToDelete}`); // API call to delete the specific item

        showNotification(response.data.successMessage, "successMessage");
        setCartItemCount(response.data.cartItemCount);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        }
      }
    }

    if (!cartItemToDelete) {
      // Case 2: Delete all cart items
      setCartItems([]); // Clear the cart from the UI

      try {
        const response = await apiService.delete("/api/clearCart"); // API call to clear the entire cart

        showNotification(response.data.successMessage, "successMessage");
        setCartItemCount(response.data.cartItemCount);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        }
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center  from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          {/* Cart Container */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <i className="bx bx-cart text-9xl"></i>
                </div>
                <p className="text-xl font-medium text-gray-600 dark:text-gray-300">Your cart is empty</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added any items to your cart yet.</p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-150 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <i className="bx bx-chevron-left h-6 text-2xl "></i>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => (
                      <li key={item.cartItem_id} className="relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                            <div className="relative h-32 w-full sm:h-24 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow duration-200">
                              <img src={BASE_API_URL + "/" + item.product_picture} alt={item.product_name} className="h-full w-full object-cover" />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 sm:ml-6 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{truncateText(item.product_name, 75)}</h3>

                              {/* Price */}
                              <div className="mt-1 flex items-center">
                                {item.discount_price > 0 ? (
                                  <>
                                    <span className="line-through text-sm text-gray-500 dark:text-gray-400 mr-2">
                                      {PriceFormat(item.selling_price)} Dhs
                                    </span>
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                      {PriceFormat(item.discount_price)} Dhs
                                    </span>
                                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                      {Math.round(((item.selling_price - item.discount_price) / item.selling_price) * 100)}% OFF
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {PriceFormat(item.selling_price)} Dhs
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls (you can add these) */}
                              <div className="mt-2 hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Quantity: {item.quantity}</span>
                                {/* Add quantity controls here if needed */}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="mt-4 sm:mt-0 sm:ml-2">
                              <button
                                onClick={() => deleteCartItem(item.cartItem_id)}
                                className="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-700 transition-colors duration-200"
                              >
                                <i className="bx bx-trash  h-5 mr-2 text-lg "></i>
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8">
                  <div className="sm:flex sm:justify-between sm:items-start">
                    {/* Summary */}
                    <div className="sm:w-1/2">
                      <div className="mb-4">
                        <button
                          onClick={() => deleteCartItem()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium 
                          text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white "
                        >
                          <i className="bx bx-trash mr-2 text-lg"></i>
                          Clear Cart
                        </button>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex justify-between">
                          <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                          <dd className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                            {PriceFormat(
                              cartItems
                                .reduce(
                                  (total, item) => total + (item.discount_price > 0 ? item.discount_price : item.selling_price) * item.quantity,
                                  0
                                )
                                .toFixed(2)
                            )}{" "}
                            Dhs
                          </dd>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-6 sm:mt-0 sm:w-1/2 sm:flex sm:flex-col sm:items-end">
                      <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1">
                        <span>Proceed to Checkout</span>
                        <i className="bx bx-chevron-right ml-1 h-5 text-2xl"></i>
                      </button>

                      <Link
                        to="/"
                        className="mt-4 inline-flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
                      >
                        <i className="bx bx-chevron-left  h-6 text-2xl "></i>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
