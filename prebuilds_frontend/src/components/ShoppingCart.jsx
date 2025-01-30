import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../api/apiService";

const ShoppingCart = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const response = await apiService.get("/api/cartItemCount");
        setCartItemCount(response.data.cartItemCount);
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, []);

  return (
    <Link to={"/ShoppingCart"} className="relative flex items-center text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
      {/* Cart icon with notification badge */}
      <div className="relative">
        <i className="bx bx-cart text-xl"></i>

        {/* Notification badge on top of the cart icon */}
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-orange-600 rounded-full">
            {cartItemCount}
          </span>
        )}
      </div>

      {/* "Shopping Cart" text */}
      <span className="ml-2">Shopping Cart</span>
    </Link>
  );
};

export default ShoppingCart;
