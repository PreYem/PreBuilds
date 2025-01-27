import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import apiService from "../api/apiService";
import setTitle, { WEBSITE_NAME } from "../utils/DocumentTitle";
import { useNavigate, useParams } from "react-router-dom";
import EditProduct from "./products/EditProduct";
import useCloseModal from "../hooks/useCloseModal";
import DeleteModal from "./DeleteModal";
import useConfirmationCountdown from "../hooks/useConfirmationCountdown";
import SearchBar from "./SearchBar";

const Home = ({ userData, user_role, title }) => {
  const [productName, setProductName] = useState("");
  const navigate = useNavigate();
  const { category } = useParams(); // Getting category from URL params
  const [pageTitle, setPageTitle] = useState(title);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Manage edit product modal visibility
  const [productToDelete, setProductToDelete] = useState(null); // Store product to delete
  const [productToEdit, setProductToEdit] = useState(null);
  const [isClosing, setIsClosing] = useState(false); // Manage closing animation state
  const [newProductDuration, setNewProductDuration] = useState(0);

  const countdown = useConfirmationCountdown(1, showDeleteModal); // Use the custom countdown hook

  useEffect(() => {
    if (!category) {
      fetchProducts();
      return;
    }

    if (category === "DiscountedProducts") {
      fetchProducts(["DiscountedProducts"]);
      return;
    }

    if (category === "NewestProducts") {
      fetchProducts(["NewestProducts"]);
      return;
    }

    const parts = category.split("-");

    if (parts.length !== 3) {
      navigate("*");
    }

    fetchProducts(parts);
  }, [category, navigate]);

  const fetchProducts = async (categoryParts = []) => {
    try {
      setLoading(true);
      setError(null); // Reset any previous errors

      let url = "/api/products"; // Default URL for general products

      if (categoryParts[0] === "DiscountedProducts") {
        url = "/api/dynaminicProducts/discountedProducts"; // URL for discounted products
      } else if (categoryParts.length === 3) {
        const [cs, id, name] = categoryParts; // Destructure if category is valid
        if (cs !== "c" && cs !== "s") {
          navigate("/ABC");
          return;
        }

        url = `/api/dynaminicProducts/${cs}-${id}`; // Adjusted URL for category/subcategory
      } else if (categoryParts == "NewestProducts") {
        url = "/api/NewestProducts"; // URL for discounted products
      }

      const response = await apiService.get(url);

      // Handle different response structures
      if (response.data.products) {
        setProducts(response.data.products);
        setPageTitle(response.data.pageTitle || title);
        setNewProductDuration(response.data.new_product_duration);
        setLoading(false);
      } else {
        setProducts(response.data);
        setPageTitle(title);
        setLoading(false);
      }
    } catch (err) {
      console.log("AAA");

      console.log("++" + err.response.data.databaseError);

      if (!err.response.data.TitleName) {
        navigate("*");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  setTitle(pageTitle);

  // Handle Product Deletion
  const handleProductDelete = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
      setProductToDelete(null);
    }, 300);
  };

  // Custom Hook to close modal.
  useCloseModal(closeDeleteModal);

  const handleDeleteProduct = () => {
    if (productToDelete) {
      apiService
        .delete(`/api/products/${productToDelete.product_id}`)
        .then(() => {
          handleProductDelete(productToDelete.product_id);
          closeDeleteModal();
        })
        .catch((err) => {
          setError("Failed to delete product.");
        });
    }
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.product_id === updatedProduct.product_id ? { ...product, ...updatedProduct } : product))
    );
  };

  return (
    <>
      <div className="flex justify-center items-center mt-14">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-500 text-transparent bg-clip-text drop-shadow-md animate-fade-in">
            Welcome to {WEBSITE_NAME}
          </h1>

          <div className="relative w-full max-w-md mx-auto mt-2 ">
            <SearchBar setProductName={setProductName} productName={""} />
          </div>

          {loading ? (
            // Show loading spinner while fetching
            <div className="w-full flex flex-wrap justify-center gap-14 p-6">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 p-3 relative animate-pulse"
                >
                  <div className="w-full h-52 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  <div className="mt-2 w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="mt-2 w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="mt-2 w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="mt-3 flex justify-between space-x-2">
                    <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p>{error}</p> // Show error message if products fail to load
          ) : products && products.length > 0 ? (
            <div className="w-full flex flex-wrap justify-center gap-14 p-6 mb-20 ">
              {products.map((product) => (
                <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6">
                  <ProductCard
                    userData={userData}
                    product={product}
                    user_role={user_role}
                    onDelete={() => handleDeleteClick(product)}
                    onEdit={() => openEditModal(product)}
                    globalNewTimer={newProductDuration}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-wrap justify-center mt-80 h-full ">
              <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">
                {pageTitle} : <span className="text-4xl font-semibold">No products available in this category.</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showModal={showDeleteModal}
        isClosing={isClosing}
        closeDeleteModal={closeDeleteModal}
        countdown={countdown}
        handleDelete={handleDeleteProduct}
        target={"Product"}
        disclaimer={
          <>
            <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> It's recommended that you{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">turn off the visiblity</span> on this product instead of deleting it
            permanently.
          </>
        }
      />

      {/* Product Edit Modal */}

      {showEditModal && <EditProduct isOpen={showEditModal} productData={productToEdit} onClose={closeEditModal} onSaveSuccess={handleSaveSuccess} />}
    </>
  );
};

export default Home;
