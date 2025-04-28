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

interface CartTypes {
  cartItem: number;
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

  const deleteCartItem = async (cartItem: number) => {

    try {
      const response = apiService.get("/api/Shopping_Cart/" + cartItem);

      

    } catch (error) {

    }



  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 w-full">
        <div className="w-full max-w-4xl p-14">
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-lg text-gray-600 dark:text-gray-300">You have no items in your shopping cart.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartItem} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <img src={BASE_API_URL + "/" + item.product_picture} alt={item.product_name} className="w-24 h-24 object-cover rounded-md" />
                    <div>
                      <p className="text-xl font-semibold text-black dark:text-white">{truncateText(item.product_name, 75)}</p>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {item.discount_price > 0 ? (
                          <>
                            <span className="line-through text-red-500 mr-2">{PriceFormat(item.selling_price)} Dhs</span>
                            <span className="text-green-500 font-semibold">{PriceFormat(item.discount_price)} Dhs</span>
                          </>
                        ) : (
                          <span className="text-green-500 font-semibold">{PriceFormat(item.selling_price)} Dhs</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button className="text-red-500 hover:text-red-700 focus:outline-none">
                    <i className="bx bxs-trash-alt"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="font-semibold text-lg text-black dark:text-white">
              <span>Total:</span>
              <span className="ml-2 text-green-500">
                {PriceFormat(
                  cartItems
                    .reduce((total, item) => total + (item.discount_price > 0 ? item.discount_price : item.selling_price) * item.quantity, 0)
                    .toFixed(2)
                )}{" "}
                Dhs
              </span>
            </div>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
