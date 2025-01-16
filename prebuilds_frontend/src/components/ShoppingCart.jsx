import React from "react";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
  return (
    <Link
      to={"/ShoppingCart"}
      className="flex items-center text-white
       hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      <i className="bx bx-cart mr-1"></i> Shopping Cart
    </Link>
  );
};

export default ShoppingCart;
