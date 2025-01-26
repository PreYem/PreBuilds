import React, { useState } from "react";
import { BASE_API_URL } from "../../api/apiConfig";
import useCloseModal from "../../hooks/useCloseModal";
import { Link } from "react-router-dom";

const CartModal = ({ product, isVisible, closeCartModal, onAddToCart, isDiscounted, user_role }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [formData, setFormData] = useState({});
  useCloseModal(closeCartModal);

  const handleQuantityChange = (e) => {
    if (e.target.value <= product.product_quantity) {
      setQuantity(e.target.value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    closeCartModal();
  };

  if (!isVisible) return null;

  if (!user_role) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 h-48 rounded-lg w-96 max-w-xs text-center shadow-lg relative">
            {/* Close Button in the top-right corner */}
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
                className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-80">
        {/* Product Image */}
        <div className="mb-4">
          <img src={BASE_API_URL + "/" + product.product_picture} alt={product.product_name} className="w-auto h-auto object-cover rounded-md" />
        </div>

        {/* Product Name */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product.product_name}</h2>

        {isDiscounted ? (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="line-through text-gray-500 mr-2">
              <b>Price : </b>
              {product.selling_price * quantity} Dhs
            </span>
            <span className="text-green-500">{product.discount_price * quantity} Dhs</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {" "}
            <b>Price : </b> {product.selling_price * quantity} Dhs
          </p>
        )}

        {/* Quantity Input */}
        <div className="mt-4">
          <label htmlFor="quantity" className="block text-sm text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={closeCartModal}
            className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 focus:outline-none dark:bg-green-600 dark:hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
