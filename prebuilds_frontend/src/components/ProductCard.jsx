// ProductCard.js
import React from "react";
import { BASE_API_URL } from "../api/apiConfig";

const ProductCard = ({ product, user_role }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0"); // Ensure 2-digit hour
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure 2-digit minute
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Ensure 2-digit second

    return `${day}/${month}/${year} At ${hours}:${minutes}:${seconds}`;
  };

  const calculateProductAge = (dateCreatedString) => {
    const dateCreated = new Date(dateCreatedString); // Convert to Date object
    const now = new Date(); // Get the current date and time

    // Calculate the difference in milliseconds
    const diffInMilliseconds = now - dateCreated;

    // Convert the difference to meaningful units
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Return age description based on the largest applicable unit
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  const product_age = calculateProductAge(product.date_created);

  const date_created = formatDate(product.date_created);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full sm:w-20 md:w-64 lg:w-64 p-3 relative transition-transform duration-300 ease-in-out transform hover:scale-105">
        {/* Product Image */}
        <a href="">
          <img
            src={BASE_API_URL + "/" + product.product_picture}
            alt={product.product_name}
            className="w-full max-h-52 object-cover object-center rounded-md"
          />

          {/* Discount Tag */}
          {product.discount_price != 0 && product.selling_price > product.discount_price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-wrap font-semibold px-2 py-1 rounded-lg shadow-md">
              -{(((product.selling_price - product.discount_price) / product.selling_price) * 100).toFixed(0)}% OFF
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-2 truncate text-left"> {product.product_name} </h3>

          {/* Product Price */}
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 mt-2 text-left">
            {product.discount_price != 0 ? (
              <>
                <span className="line-through text-blue-500 dark:text-gray-400 text-sm">{product.selling_price} Dhs</span>
                <span className="text-green-500 ml-2">{product.discount_price} Dhs</span>
              </>
            ) : (
              <span className="text-blue-500 dark:text-gray-400">{product.selling_price} Dhs</span>
            )}
          </p>
        </a>
        {/* Stock Availability */}
        <p
          className={`mt-2 text-base font-medium text-left ${
            product.product_quantity > 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
          }`}
        >
          {product.product_quantity > 0 ? `In Stock (${product.product_quantity})` : "Out of Stock"}
        </p>

        {/* Product Metadata */}
        {user_role && user_role !== "Client" ? (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-left">
            <p>
              <span className="font-semibold">Created :</span> {date_created}
            </p>
            <p>
              <span className="font-semibold">Age:</span> {product_age}
            </p>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="mt-3 flex justify-between space-x-2 text-sm">
          {user_role && user_role !== "Client" ? (
            <>
              <button className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300">
                Add to Cart <i className="bx bxs-cart-add"></i>
              </button>
              <button className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition ease-in-out duration-300 text-sm">
                <i className="bx bxs-cog"></i>
              </button>
              <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm">
                <i className="bx bxs-trash-alt"></i>
              </button>
            </>
          ) : product.product_quantity > 0 ? (
            <button className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 w-full">
              Add to Cart <i className="bx bxs-cart-add"></i>
            </button>
          ) : (
            <button className="bg-gray-500 text-white py-1 px-3 rounded-lg cursor-not-allowed w-full">Out of Stock</button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
