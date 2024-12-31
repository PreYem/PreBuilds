import React, { useEffect, useState } from "react";
import setTitle from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { truncateText } from "../../utils/TruncateText";
import EditCategory from "../categories/EditCategory";

const SubCategoriesList = ({ userData, title }) => {
  setTitle(title);
  useRoleRedirect(userData, ["Owner", "Admin"]);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // For sorting

  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null); // Store the category to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing
  const [sortedSubCategories, setSortedSubCategories] = useState([]);

  useEffect(() => {
    apiService
      .get("/api/subcategories")
      .then((response) => {
        setSubCategories(response.data);
        setSortedSubCategories(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setSubCategories([]);
      });
  }, []);

  const handleDeleteSubCategory = async () => {
    console.log(subCategoryToDelete);

    try {
      const response = await apiService.delete("/api/subcategories/" + subCategoryToDelete, { withCredentials: true });
      console.log("Response from DB:", response.data); // Log the response data

      // Update both categories and sortedCategories
      setSubCategories((prevSubCategories) => {
        const updatedSubCategories = prevSubCategories.filter((subCategory) => subCategory.subcategory_id !== subCategoryToDelete);
        setSortedSubCategories(updatedSubCategories); // Ensure sorted categories is in sync
        return updatedSubCategories;
      });

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const openDeleteModal = (subcategory) => {
    setSubCategoryToDelete(subcategory.subcategory_id);
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSort = (key) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });

    const sorted = [...subCategories].sort((a, b) => {
      if (a[key] < b[key]) return newDirection === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedSubCategories(sorted);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="pt-20 -ml-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max ">
        <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">List of Currently Registered Sub-Categories</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th
                  className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm"
                  onClick={() => handleSort("subcategory_display_order")}
                >
                  Display Order🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm " onClick={() => handleSort("subcategory_name")}>
                  Sub-Category Name🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("subcategory_description")}>
                  Sub-Category Description🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("parent_category_name")}>
                  Parent Category 🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("product_count")}>
                  Product Count🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubCategories?.map((subCategory) => (
                <tr key={subCategory.subcategory_id}>
                  <td className="py-2 px-4 border-b dark:border-gray-600  ">{subCategory.subcategory_display_order}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.subcategory_name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(subCategory.subcategory_description, 100)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.parent_category_name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.product_count}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600  space-x-2">
                    {subCategory.subcategory_name !== "Unspecified" ? (
                      <>
                        <button
                          className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm link-spacing"
                          onClick={() => openEditModal(subCategory)}
                        >
                          <i className="bx bx-cog"></i>
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm"
                          onClick={() => openDeleteModal(subCategory)}
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

      {/* Edit Sub-Category Modal */}
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
              <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> All products under this Sub-Category will be moved to
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                {"<"}Unspecified{">"}{" "}
              </span>
              Sub-Category.
            </span>

            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteSubCategory} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategoriesList;
