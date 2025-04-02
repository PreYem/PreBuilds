import { useEffect, useState } from "react";
import ProductCard, { Product } from "../components/ProductCard";
import apiService from "../api/apiService";
import setTitle, { TitleType, WEBSITE_NAME } from "../utils/DocumentTitle";
import { useNavigate, useParams } from "react-router-dom";
import EditProduct from "./products/EditProduct";
import useCloseModal from "../hooks/useCloseModal";
import DeleteModal from "./DeleteModal";
import useConfirmationCountdown from "../hooks/useConfirmationCountdown";
import SearchBar from "./SearchBar";
import { AxiosError } from "axios";
import CategoryDescription from "./CategoryDescription";
import { useNotification } from "../context/GlobalNotificationContext";

const Home = ({ title }: TitleType) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [description, setDescription] = useState<string>("");
  const { category } = useParams();
  const [pageTitle, setPageTitle] = useState(title);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Manage edit product modal visibility
  const [productToDelete, setProductToDelete] = useState<Product | null>(null); // Store product to delete
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
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

  const fetchProducts = async (categoryParts: string[] = []) => {
    try {
      setLoading(true);
      setDatabaseError(""); // Reset any previous databaseErrors

      let url = "/api/products"; // Default URL for general products

      if (categoryParts[0] === "DiscountedProducts") {
        url = "/api/dynaminicProducts/discountedProducts"; // URL for discounted products
      } else if (categoryParts.length === 3) {
        const [cs, id, name] = categoryParts; // Destructure if category is valid
        if (cs !== "c" && cs !== "s") {
          navigate("*");
          return;
        }

        url = "/api/dynaminicProducts/" + cs + "-" + id; // Adjusted URL for category/subcategory
      } else if (categoryParts[0] === "NewestProducts") {
        url = "/api/NewestProducts"; // URL for newest products
      }

      const response = await apiService.get(url);

      // Handle different response structures
      if (response.data.products) {
        setProducts(response.data.products);
        setPageTitle(response.data.pageTitle || title);
        setNewProductDuration(response.data.new_product_duration);
        setDescription(response.data.description);
      } else {
        setProducts(response.data);
        setPageTitle(title);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }
  };

  setTitle(pageTitle);

  const handleProductDelete = (productId: number) => {
    setProducts((prevProducts) => {
      if (!prevProducts) return []; // Ensure prevProducts is not null
      return prevProducts.filter((product: Product) => product.product_id !== productId);
    });
  };

  const handleDeleteClick = (product: Product) => {
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

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await apiService.delete("/api/products/" + productToDelete.product_id);

      handleProductDelete(productToDelete.product_id);
      closeDeleteModal();
      showNotification(response.data.successMessage, "successMessage");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      } else {
        showNotification("An unexpected error occurred.", "databaseError");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveSuccess = (updatedProduct: Product) => {
    setProducts((prevProducts) => {
      if (!prevProducts) return []; // Ensure prevProducts is not null
      return prevProducts.map((product) => (product.product_id === updatedProduct.product_id ? { ...product, ...updatedProduct } : product));
    });
  };

  return (
    <>
      <div className="flex justify-center items-center mt-14">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-500 text-transparent bg-clip-text drop-shadow-md animate-fade-in">
            Welcome 2 {"<\\" + WEBSITE_NAME + "/>"}
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-md mx-auto mt-2">
            <SearchBar />
          </div>

          {/* Category Description Component */}
          {description && <CategoryDescription description={description} pageTitle={pageTitle} />}

          {loading ? (
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
          ) : databaseError ? (
            <p>{databaseError}</p>
          ) : products && products.length > 0 ? (
            <div className="w-full flex flex-wrap justify-center gap-14 p-6 mb-20">
              {products.map((product) => (
                <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6">
                  <ProductCard
                    product={product}
                    onDelete={() => handleDeleteClick(product)}
                    onEdit={() => openEditModal(product)}
                    globalNewTimer={newProductDuration}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-wrap justify-center mt-80 h-full">
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
      {showEditModal && productToEdit && (
        <EditProduct isOpen={showEditModal} productData={productToEdit} onClose={closeEditModal} onSaveSuccess={handleSaveSuccess} />
      )}
    </>
  );
};

export default Home;
