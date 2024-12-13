import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setProducts(null);
      });
  }, []);

  document.title = "Home | PreBuilds";
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-lg">Hello, world!</p>
          <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
          <h1 className="text-3xl font-bold">Our Products</h1>

          {products
            ? products.map((product) => (
                <>
                  <li key={product.product_id}> {product.product_name} - {product.product_id} </li>
                  <img src={`http://localhost:8000/${product.product_picture}`} alt="Product" />
                </>
              ))
            : ""}
        </div>
      </div>
    </>
  );
};

export default Home;
