import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import apiService from "../api/apiService";
import setTitle from "../utils/DocumentTitle";

const Home = ({ user_role, title }) => {
  setTitle(title);

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

  // Function to handle product deletion
  const handleProductDelete = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
  };

  return (
    <>
      <div className="flex bg-green-700 justify-center items-center h-full mb-12">
        <div className="text-center w-full">
          <p className="text-lg">Hello, world!</p>
          <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
          <h1 className="text-3xl font-bold">Our Products</h1>

          {loading ? (
            // Show a loading spinner while data is being fetched
            <div className="w-full flex flex-wrap justify-center gap-14 p-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 p-3 relative animate-pulse"
                >
                  {/* Product Image Skeleton */}
                  <div className="w-full h-52 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  {/* Product Name Skeleton */}
                  <div className="mt-2 w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  {/* Product Price Skeleton */}
                  <div className="mt-2 w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  {/* Stock Availability Skeleton */}
                  <div className="mt-2 w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  {/* Action Buttons Skeleton */}
                  <div className="mt-3 flex justify-between space-x-2">
                    <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products ? (
            <>
              <div className="bg-red-600 w-full flex flex-wrap justify-center gap-14 p-6">
                {products.map((product) => (
                  <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6">
                    <ProductCard
                      product={product}
                      user_role={user_role}
                      onDelete={handleProductDelete} // Pass the delete handler
                    />
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
