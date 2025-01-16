import React, { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import setTitle from "../../utils/DocumentTitle";
import { truncateText } from "../../utils/TruncateText";
import EditCategory from "./EditCategory";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import useCloseModal from "../../hooks/useCloseModal";

const CategoriesList = ({ userData, title, categories, setCategories }) => {
  setTitle(title);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // For sorting
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Store the category to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing

  useRoleRedirect(userData, ["Owner", "Admin"]);

  useEffect(() => {
    apiService
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
        setSortedCategories(response.data); // Initialize sorted data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  const openEditModal = (category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };
  

  const handleSaveSuccess = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat.category_id === updatedCategory.category_id ? { ...cat, ...updatedCategory } : cat))
    );
    setSortedCategories((prevSorted) =>
      prevSorted.map((cat) => (cat.category_id === updatedCategory.category_id ? { ...cat, ...updatedCategory } : cat))
    );
  };

  const handleDeleteCategory = async () => {
    try {
      await apiService.delete("/api/categories/" + categoryToDelete, { withCredentials: true });

      // Update both categories and sortedCategories
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category.category_id !== categoryToDelete);
        setSortedCategories(updatedCategories); // Ensure sorted categories is in sync
        return updatedCategories;
      });

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openDeleteModal = (category_id) => {
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
  useCloseModal(closeDeleteModal);

  const handleSort = (key) => {
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
      <div className="pt-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max ">
        <h1
          className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-200 text-center bg-gradient-to-r 
        from-blue-500 to-purple-500 dark:from-purple-500 dark:to-blue-500 text-transparent bg-clip-text  p-2 rounded-md
        border-1 "
        >
          Categories Dashboard
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg transition-transform duration-1000 max-w-3xl mx-auto sticky top-20 z-50">
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
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories?.map((category, index) => (
                <tr key={category.category_id} className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}>
                  <Link
                    to={`/c-${category.category_id}-${category.category_name.replace(/\s+/g, "")}`}
                    className="contents group" // 'group' is used for hover effect targeting
                  >
                    <td className="py-2 px-4 border-b dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                      {category.category_display_order}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                      {truncateText(category.category_name, 15)}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                      {truncateText(category.category_description, 100)}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                      {category.subcategory_count}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                      {category.product_count}
                    </td>
                  </Link>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Modal */}
      {showEditModal && (
        <EditCategory isOpen={showEditModal} categoryData={categoryToEdit} onClose={closeEditModal} onSaveSuccess={handleSaveSuccess} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-96 transition-all duration-300 ease-in-out transform ${
              isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to proceed? <br />
            </h3>
            <span className="text-red-500 font-bold bg-yellow-100 p-2 rounded border border-yellow-500 mt-2 inline-block">
              ⚠️ This action is <span className="font-semibold">irreversible</span> and cannot be undone.
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600 mt-2 inline-block">
              <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> All Products and Sub-Categories under this Category
              will be moved to
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                {"<"}Unspecified{">"}{" "}
              </span>
              Category.
            </span>

            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteCategory} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                Delete Category Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesList;
