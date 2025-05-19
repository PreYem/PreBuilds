import React, { useEffect, useRef, useState } from "react";
import { BASE_API_URL } from "../../api/apiConfig";
import useCloseModal from "../../hooks/useCloseModal";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";
import { useCart } from "../../context/CartItemCountContext";
import { useSessionContext } from "../../context/SessionContext";
import { Product } from "../../components/ProductCard";
import { AxiosError } from "axios";
import { useNotification } from "../../context/GlobalNotificationContext";
import { PriceFormat } from "../../utils/PriceFormat";

interface Props {
  product: Product;
  isVisible: boolean;
  closeCartModal: () => void;
  isDiscounted: boolean;
}

const CartModal = ({ product, isVisible, closeCartModal, isDiscounted }: Props) => {
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();
  const modalRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const { setCartItemCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    user_id: userData?.user_id || "",
    product_id: product?.product_id || "",
    product_quantity: 1,
  });

  useCloseModal(modalRef, closeCartModal);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_id: userData?.user_id || "",
      product_id: product?.product_id || "",
      product_quantity: quantity,
    }));
  }, [userData, product, quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity > 0 && newQuantity <= product?.product_quantity) {
      setQuantity(newQuantity);
      setFormData((prev) => ({
        ...prev,
        product_quantity: newQuantity,
      }));
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await apiService.post("/api/shopping_cart", formData);

      if (response.status === 201) {
        closeCartModal();
        setCartItemCount(response.data.itemCartCount);
        showNotification(response.data.successMessage, "successMessage");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      } else {
        showNotification("An unexpected error occurred.", "databaseError");
      }
    } finally {
      setLoading(false); // Stop loading after request finishes
    }
  };

  if (!isVisible) return null;

  if (!userData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 h-48 rounded-lg w-96 max-w-xs text-center shadow-lg relative" ref={modalRef}>
          <button
            onClick={closeCartModal}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center pb-1 bg-red-500 text-white hover:bg-red-600 rounded-full text-xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Login Required</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">You need to log in to add products to your shopping cart.</p>
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-80" ref={modalRef}>
        <div className="mb-4">
          <img
            src={product?.product_picture ? BASE_API_URL + "/" + product.product_picture : "/placeholder.jpg"}
            alt={product?.product_name || "Product"}
            className="w-auto h-auto object-cover rounded-md"
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product?.product_name}</h2>

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <b>Price:</b>{" "}
          {isDiscounted ? (
            <>
              {" "}
              <strong>
                <span className="line-through text-gray-500 mr-2">{PriceFormat(product.selling_price * quantity)} Dhs</span>
                <span className="text-green-500">{PriceFormat(product.discount_price * quantity)} Dhs</span>
              </strong>
            </>
          ) : (
            <strong>{PriceFormat(product.selling_price * quantity) + " Dhs"}</strong>
          )}
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mt-4">
            <label htmlFor="quantity" className="block text-sm text-gray-700 dark:text-gray-300">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-1/3   mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button onClick={closeCartModal} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
              Cancel
            </button>
            <button disabled={loading} onClick={handleAddToCart} className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600">
              {loading ? "Saving to Cart..." : "Add to Cart"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartModal;
