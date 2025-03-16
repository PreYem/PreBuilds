import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../api/apiConfig";
import { formatDate, calculateProductAge } from "../utils/ProductDate";
import { Link } from "react-router-dom";
import CartModal from "../pages/products/CartModal";

export interface ProductTypes {
  product_id: number;
  product_name: string;
  selling_price: number;
  discount_price: number;
  product_visibility: string;
  product_quantity: number

}

const ProductCard = ({ userData, product, user_role, onDelete, onEdit, globalNewTimer }) => {
  const { product_age, product_age_in_minutes } = calculateProductAge(product.date_created);
  const date_created = formatDate(product.date_created);
  const [isHovered, setIsHovered] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [productCart, setProductCart] = useState(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const isDiscounted = product.discount_price > 0;

  useEffect(() => {
    const { product_age_in_minutes } = calculateProductAge(product.date_created);
    setIsNew(product_age_in_minutes <= globalNewTimer);
  }, [product.date_created, globalNewTimer]);

  const showCartModal = (product) => {
    setProductCart(product);
    setCartModal(true);
    console.log("showing cart modal");
  };

  const closeCartModal = () => {
    setCartModal(false);
  };

  const handleAddToCart = (product, quantity) => {};

  return (
    <>
      <div
        className={
          "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full sm:w-20 md:w-64 lg:w-64 p-3 relative transition-transform duration-300 ease-in-out transform hover:scale-105" +
          (product.product_quantity == 0 ? "filter grayscale" : "")
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        <Link to={"/Product/" + product.product_id}>
          <img
            src={BASE_API_URL + "/" + product.product_picture}
            alt={product.product_name}
            className={"w-full min-h-56 max-h-56 object-cover object-center rounded-md "}
          />
          {/* Discount Tag */}
          {isDiscounted && (
            <span
              className={`absolute top-2 left-2 bg-yellow-600 text-white font-semibold px-2 py-1 rounded-lg shadow-md text-sm transition-opacity duration-300 ease-in-out ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {Math.min((((product.selling_price - product.discount_price) / product.selling_price) * 100).toFixed(0), 99)}% OFF <br /> -
              {product.selling_price - product.discount_price} Dhs
            </span>
          )}
          {isNew && (
            <span className="absolute top-2 right-2 bg-green-600 text-white font-semibold px-3 py-2 rounded-lg shadow-md transform rotate-12 text-xs transition-all duration-200 ease-in-out hover:scale-110 sparkle">
              NEW
            </span>
          )}

          {/* Invisiblity Tag */}
          {product.product_visibility === "Invisible" && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg shadow-md text-xs">
              Status: OFF
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-2 truncate text-left">
            {(user_role === "Owner" || user_role === "Admin" ? product.product_id + " : " : "") + product.product_name}
          </h3>
          {/* Product Price */}
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 mt-2 text-left">
            {isDiscounted ? (
              <>
                <span className="line-through text-blue-500 dark:text-gray-400 text-sm">{product.selling_price} Dhs</span>
                <span className="text-green-500 ml-2">{product.discount_price} Dhs</span>
              </>
            ) : (
              <span className="text-blue-500 dark:text-gray-400">{product.selling_price} Dhs</span>
            )}
          </p>
        </Link>

        {user_role === "Owner" || user_role === "Admin" ? (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 ">
            <span className="block">
              Created on <span className="text-blue-600 dark:text-blue-400 font-semibold">{date_created} </span>
              {" ("}
              <span className="text-green-600 dark:text-green-400 font-semibold">{product_age}</span> old
              {")"}
            </span>
          </p>
        ) : (
          ""
        )}

        {/* Stock Availability */}
        <p
          className={`mt-2 text-base font-medium text-left ${
            product.product_quantity > 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
          }`}
        >
          {product.product_quantity > 0 ? `In Stock (${product.product_quantity})` : "Out of Stock"}
        </p>
        {/* Action Buttons */}
        <div className="mt-3 flex justify-between space-x-2 text-sm">
          {/* Add to Cart button should show when product quantity is > 0 OR user role is not null and not "Client" */}
          {product.product_quantity > 0 || (user_role && user_role !== "Client") ? (
            <button
              onClick={() => showCartModal(product)}
              className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 w-full"
            >
              Add to Cart <i className="bx bxs-cart-add"></i>
            </button>
          ) : (
            <span className="text-gray-500 dark:text-gray-300 italic text-sm">Check again soon</span>
          )}

          {/* Show Edit and Delete buttons only if user_role is not "Client" */}
          {user_role && user_role !== "Client" && (
            <>
              <button
                onClick={onEdit}
                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition ease-in-out duration-300 text-sm"
              >
                <i className="bx bxs-cog"></i>
              </button>
              <button
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm"
                onClick={() => onDelete(product)}
              >
                <i className="bx bxs-trash-alt"></i>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Cart Modal */}
      <CartModal
        userData={userData}
        product={productCart}
        isVisible={cartModal}
        closeCartModal={closeCartModal}
        onAddToCart={handleAddToCart}
        isDiscounted={isDiscounted}
        user_role={user_role}
      />
    </>
  );
};

export default ProductCard;
