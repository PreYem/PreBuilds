import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import apiService from "../../api/apiService";
import { BASE_API_URL } from "../../api/apiConfig";

const Home = ( { user_role } ) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    apiService
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products"); // Handle the error
        setLoading(false);
      });
  }, []);

  document.title = "Home | PreBuilds";


  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-lg">Hello, world!</p>
          <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
          <h1 className="text-3xl font-bold">Our Products </h1>

          {loading ? (
            // Show a loading spinner while data is being fetched
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : products ? (
            <>
              <div className="flex flex-wrap justify-center gap-6 p-6">
                {products.map((product) => (
                  <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <ProductCard product={product} user_role={user_role}  />
                  </div>
                ))}
              </div>
            </>
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
