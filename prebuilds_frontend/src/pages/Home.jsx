import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import apiService from "../api/apiService";
import setTitle from "../utils/DocumentTitle";

const Home = ({ user_role, title }) => {
  setTitle(title);

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State for error handling
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage modal visibility
  const [productToDelete, setProductToDelete] = useState(null); // Store product to delete
  const [isClosing, setIsClosing] = useState(false); // Manage closing animation state

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

  const handleDeleteClick = (product) => {
    setProductToDelete(product); // Set the product to delete
    setShowDeleteModal(true); // Show the modal
  };

  const closeDeleteModal = () => {
    setIsClosing(true); // Start closing animation
    setTimeout(() => {
      setShowDeleteModal(false); // Hide the modal after animation completes
      setIsClosing(false);
      setProductToDelete(null); // Reset product to delete
    }, 300); // Match this duration to the animation duration
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      // Here you would typically send a request to the backend to delete the product
      apiService
        .delete("/api/products/" + productToDelete.product_id)
        .then(() => {
          handleProductDelete(productToDelete.product_id); // Remove the product from state
          closeDeleteModal(); // Close the modal
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          setError("Failed to delete product");
        });
    }
  };

  return (
    <>
      <div className="flex bg-green-700 justify-center items-center h-full pt-14">
        <div className="text-center w-full">
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
                      onDelete={() => handleDeleteClick(product)} // Pass the delete handler
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Handle the case where there are no products or an error occurred
            <p>No products available, come back later.</p>
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-gray-800 p-3 pb-3 rounded-lg w-96 transition-all duration-300 ease-in-out transform ${
              isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to proceed? <br />
            </h3>
            <span className="text-red-500 font-semibold bg-yellow-100 p-2 rounded border border-yellow-500 mt-2 inline-block">
              ⚠️ This action is <span className="font-bold">irreversible</span> and cannot be undone.
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600 mt-2 inline-block">
              <span className="font-semibold text-green-600 dark:text-green-400">Recommended :</span> Instead of deleting, consider turning off this product's
              visibility.
            </span>

            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteProduct} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
