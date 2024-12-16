// ProductCard.js
import React from "react";
import { BASE_API_URL } from "../api/apiConfig";

const ProductCard = ({ product, user_role }) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full sm:w-56 md:w-64 lg:w-72 p-3 relative">
        {/* Product Image */}
        <img
          src={BASE_API_URL + "/" + product.product_picture}
          alt={product.product_name}
          className="w-full h-48 object-cover object-center rounded-md"
        />

        {/* Discount Tag */}
        {product.discount_price && product.selling_price > product.discount_price && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
            -{(((product.selling_price - product.discount_price) / product.selling_price) * 100).toFixed(0)}% OFF
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-2 truncate">{product.product_name}</h3>

        {/* Product Price */}
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-2">
          {product.discount_price ? (
            <>
              <span className="line-through text-gray-500 dark:text-gray-400 text-xs">{product.selling_price} Dhs</span>
              <span className="text-green-500 ml-2">{product.discount_price} Dhs</span>
            </>
          ) : (
            <span>{product.selling_price} Dhs</span>
          )}
        </p>

        {/* Stock Availability */}
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
          {product.product_quantity > 0 ? (
            <span className="text-green-500">{`In Stock (${product.product_quantity})`}</span>
          ) : (
            <span className="text-red-500">Out of Stock</span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="mt-3 flex justify-between space-x-2 text-sm">
          <button className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300">
            Add to Cart 🛒
          </button>

          {/* Check if user_role is not "Client" or user_role is null */}
          {user_role !== "Client" || user_role !== null ? (
            <>
              <button className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 text-sm">⚙️</button>
              <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 text-sm">🗑️</button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
