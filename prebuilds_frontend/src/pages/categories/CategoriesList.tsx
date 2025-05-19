import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import { truncateText } from "../../utils/TruncateText";
import EditCategory from "./EditCategory";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import useCloseModal from "../../hooks/useCloseModal";
import useConfirmationCountdown from "../../hooks/useConfirmationCountdown";
import DeleteModal from "../DeleteModal";
import { useSessionContext } from "../../context/SessionContext";
import { useCategories } from "../../context/Category-SubCategoryContext";
import { AxiosError } from "axios";
import { useNotification } from "../../context/GlobalNotificationContext";

export interface Category {
  category_id: number;
  category_name: string;
  category_description: string;
  category_display_order: number;
  subcategory_count: number;
  product_count: number;
}

const CategoriesList = ({ title }: TitleType) => {
  const { userData } = useSessionContext();
  const { deleteCategory } = useCategories();
  const { showNotification } = useNotification();
  

  useRoleRedirect(["Owner", "Admin"]);

  const [categories, setCategories] = useState<Category[]>([]);

  setTitle(title);

  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category>();
  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Category | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number>(); // Store the category to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing

  const countdown = useConfirmationCountdown(3, showDeleteModal); // Use the custom countdown hook

  useEffect(() => {
    apiService
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
        setSortedCategories(response.data); // Initialize sorted data

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:");
        setCategories([]);
      });
  }, []);

  const openEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveSuccess = (updatedCategory: Category) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat.category_id === updatedCategory.category_id ? { ...cat, ...updatedCategory } : cat))
    );
    setSortedCategories((prevSorted) =>
      prevSorted.map((cat) => (cat.category_id === updatedCategory.category_id ? { ...cat, ...updatedCategory } : cat))
    );
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete !== undefined) {
      try {
        const response = await apiService.delete("/api/categories/" + categoryToDelete);

        showNotification(response.data.successMessage, "successMessage");

        setCategories((prevCategories) => {
          const updatedCategories = prevCategories.filter((category) => category.category_id !== categoryToDelete);
          setSortedCategories(updatedCategories);
          return updatedCategories;
        });

        deleteCategory(categoryToDelete);

        setShowDeleteModal(false);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        }
      }
    } else {
      console.error("Category to delete is not defined");
    }
  };

  const openDeleteModal = (category_id: number) => {
    setCategoryToDelete(category_id);
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
    }, 300);
  };

  // Custom Hook to close modal.

  const handleSort = (key: keyof Category) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });

    const sorted = [...categories].sort((a, b) => {
      if (a[key] < b[key]) return newDirection === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedCategories(sorted);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="pt-20 min-h-screen bg-gray-100 dark:bg-gray-900 w-full mb-8 flex justify-center">
        <div className="max-w-[1700px] w-full px-4">
          <h1
            className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-200 text-center bg-gradient-to-r 
        from-blue-500 to-purple-500 dark:from-purple-500 dark:to-blue-500 text-transparent bg-clip-text  p-2 rounded-md
        border-1 "
          >
            Categories Dashboard
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg transition-transform duration-1000 max-w-3xl mx-auto sticky top-20 z-0">
            <Link
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-1000"
              to="/AddCategory"
            >
              <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
              <i className="bx bxs-add-to-queue"></i> Add Category
            </Link>
            <Link
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
              to="/AddSubCategory"
            >
              <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
              <i className="bx bxs-add-to-queue"></i> Add Sub-Category
            </Link>
            <Link
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
              to="/SubCategoriesList"
            >
              <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
              <i className="bx bx-list-ul"></i> Sub-Categories List
            </Link>
            <Link
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
              to="/AddProduct"
            >
              <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
              <i className="bx bxs-add-to-queue"></i> Add Product
            </Link>
            <Link
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
              to="/ProductsList"
            >
              <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
              <i className="bx bx-list-ul"></i> Product List
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-800 dark:bg-gray-700 text-white">
                <tr>
                  <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("category_display_order")}>
                    Display Order🠻
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("category_name")}>
                    Category Name🠻
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("category_description")}>
                    Category Description🠻
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("subcategory_count")}>
                    SubCategory Count🠻
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("product_count")}>
                    Product Count🠻
                  </th>
                  {userData?.user_role === "Owner" && <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>}
                </tr>
              </thead>
              <tbody>
                {sortedCategories?.map((category, index) => (
                  <tr key={category.category_id} className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}>
                    <td className="py-2 px-4 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Link to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                        {category.category_display_order}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Link to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                        {truncateText(category.category_name, 15)}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Link to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                        {truncateText(category.category_description, 100)}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Link to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                        {category.subcategory_count}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Link to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                        {category.product_count}
                      </Link>
                    </td>
                    {userData?.user_role === "Owner" && (
                      <td className="py-2 px-4 border-b dark:border-gray-600 space-x-2">
                        {category.category_name !== "Unspecified" ? (
                          <>
                            <button
                              onClick={() => openEditModal(category)}
                              className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm link-spacing"
                            >
                              <i className="bx bx-cog"></i>
                            </button>
                            <button
                              onClick={() => openDeleteModal(category.category_id)}
                              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm"
                            >
                              <i className="bx bxs-trash-alt"></i>
                            </button>
                          </>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Category Modal */}
        {showEditModal && categoryToEdit && (
          <EditCategory isOpen={showEditModal} categoryData={categoryToEdit} onClose={closeEditModal} onSaveSuccess={handleSaveSuccess} />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          showModal={showDeleteModal}
          isClosing={isClosing}
          countdown={countdown}
          closeDeleteModal={closeDeleteModal}
          handleDelete={handleDeleteCategory}
          target={"Category"}
          disclaimer={
            <>
              <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> All Products and Sub-Categories under this Category
              will be moved to
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                {"<"}Unspecified{">"}{" "}
              </span>
              Category.
            </>
          }
        />
      </div>
    </>
  );
};

export default CategoriesList;
