import { useEffect, useState } from "react";
import { TitleType } from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import { useNotification } from "../../context/GlobalNotificationContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../api/apiConfig";

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
  const { showNotification } = useNotification();
  useRoleRedirect(["Owner", "Admin", "Client"]);
  const [cartItems, setCartItems] = useState<CartTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/shopping_cart");

        setCartItems(response.data.cartItems);
      } catch (error) {
        showNotification("An unexpected error has occurred while fetching data", "databaseError");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

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
                      <p className="text-xl font-semibold text-black dark:text-white">{item.product_name}</p>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {item.discount_price > 0 && <span className="line-through text-red-500 mr-2">{item.selling_price}</span>}
                        <span className="text-green-500 font-semibold">{item.discount_price}</span>
                      </p>
                    </div>
                  </div>

                  <button className="text-red-500 hover:text-red-700 focus:outline-none">Remove</button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="font-semibold text-lg text-black dark:text-white">
              <span>Total:</span>
              <span className="ml-2 text-green-500">
                $
                {cartItems
                  .reduce((total, item) => total + (item.discount_price > 0 ? item.discount_price : item.selling_price) * item.quantity, 0)
                  .toFixed(2)}
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
