import { useEffect, useRef, useState } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);

  const [description, setDescription] = useState<string>("");
  const { category } = useParams();
  const [pageTitle, setPageTitle] = useState(title);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Manage edit product modal visibility
  const [productToDelete, setProductToDelete] = useState<Product | null>(null); // Store product to delete
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isClosing, setIsClosing] = useState(false); // Manage closing animation state
  const [newProductDuration, setNewProductDuration] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1); // default to 1 to avoid edge cases

  const countdown = useConfirmationCountdown(1, showDeleteModal); // Use the custom countdown hook

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    if (!category) {
      fetchProducts([], currentPage);
      return;
    }

    const parts = category.split("-");

    if (category === "DiscountedProducts" || category === "NewestProducts") {
      fetchProducts([category], currentPage);
      return;
    }

    if (parts.length !== 3) {
      navigate("*");
      return;
    }

    fetchProducts(parts, currentPage);
  }, [category, currentPage, navigate]);

  const fetchProducts = async (categoryParts: string[] = [], page = currentPage) => {
    try {
      setLoading(true);

      let url = `/api/products?page=${page}`;

      if (categoryParts[0] === "DiscountedProducts") {
        url = `/api/dynaminicProducts/discountedProducts?page=${page}`;
      } else if (categoryParts.length === 3) {
        const [cs, id, name] = categoryParts;
        if (cs !== "c" && cs !== "s") {
          navigate("*");
          return;
        }
        url = `/api/dynaminicProducts/${cs}-${id}?page=${page}`;
      } else if (categoryParts[0] === "NewestProducts") {
        url = `/api/NewestProducts?page=${page}`;
      }

      const response = await apiService.get(url);

      if (response.data.products) {
        setProducts(response.data.products.data);
        setPageTitle(response.data.pageTitle || title);
        setNewProductDuration(response.data.new_product_duration);
        setDescription(response.data.description);
        setTotalPages(response.data.products.last_page);
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

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await apiService.delete("/api/products/" + productToDelete.product_id);

      handleProductDelete(productToDelete.product_id);
      closeDeleteModal();
      if (response.data.successMessage) {
        showNotification(response.data.successMessage, "successMessage");
      } else {
        showNotification("Warning : " + response.data.warningMessage, "warningMessage");
      }
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
            Welcome to {"<\\" + WEBSITE_NAME + "/>"}
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-md mx-auto mt-2">
            <SearchBar />
          </div>

          <div className="flex justify-center  space-x-2">
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {/* Prev Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 rounded-md font-semibold border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
                  >
                    ← Prev
                  </button>
                )}

                {/* Page Buttons */}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let page;

                  if (currentPage <= 2) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    page = totalPages - 2 + i;
                  } else {
                    page = currentPage - 1 + i;
                  }

                  return (
                    page > 0 &&
                    page <= totalPages && (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-md font-semibold border ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 rounded-md font-semibold border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Category Description Component */}
          {description && <CategoryDescription description={description} pageTitle={pageTitle} />}

          {loading ? (
            <div className="w-full flex justify-center">
              <div className="w-4/5 flex flex-wrap justify-center gap-14 p-6 mb-20">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 animate-pulse">
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg p-3 relative">
                      <div className="w-full h-52 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                      <div className="mt-2 w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="mt-2 w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="mt-2 w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="mt-3 flex justify-between space-x-2">
                        <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="w-2/5 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="w-full flex justify-center">
              <div className="w-4/5 flex flex-wrap justify-center gap-14 p-6 mb-20">
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

      {/* Pagination */}
      <div className="flex justify-center mb-6 space-x-2">
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {/* Prev Button */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 rounded-md font-semibold border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
              >
                ← Prev
              </button>
            )}

            {/* Page Buttons */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let page;

              if (currentPage <= 2) {
                page = i + 1;
              } else if (currentPage >= totalPages - 1) {
                page = totalPages - 2 + i;
              } else {
                page = currentPage - 1 + i;
              }

              return (
                page > 0 &&
                page <= totalPages && (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md font-semibold border ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 rounded-md font-semibold border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
              >
                Next →
              </button>
            )}
          </div>
        )}
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
