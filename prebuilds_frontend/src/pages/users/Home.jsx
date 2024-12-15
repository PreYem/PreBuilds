import React, { useEffect, useState } from "react";
import axios from "axios";
import apiService from "../../api/apiService";
import { BASE_API_URL } from "../../api/apiConfig";

const Home = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    apiService
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setProducts(null);
        setLoading(false); // Stop loading even if there's an error
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

          {loading ? (
            // Show a loading spinner while data is being fetched
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : products ? (
            // Display products once fetched
            products.map((product) => (
              <div key={product.product_id}>
                <li>
                  {product.product_name} - {product.product_id}
                </li>

                <img src={BASE_API_URL + "/" + product.product_picture} alt="Product" className="max-w-xs" />
              </div>
            ))
          ) : (
            // Handle the case where there are no products or an error occurred
            <p>No products available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
