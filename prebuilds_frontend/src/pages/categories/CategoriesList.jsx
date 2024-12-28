import React, { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { Link, useNavigate } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import { truncateText } from "../../utils/TruncateText";

const CategoriesList = ({ userData, title, categories, setCategories }) => {
  setTitle(title);
  const navigate = useNavigate();
  
  const [sortedCategories, setSortedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // For sorting
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Store the category to delete

  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing

  useEffect(() => {
    if (userData === null) {
      navigate("*");
      return;
    }

    if (userData.user_role !== "Owner" && userData.user_role !== "Admin") {
      console.log(userData);
      
      navigate("*");
    }
  }, [userData, navigate]);

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

  const handleDeleteCategory = async () => {
    try {
      await apiService.delete("/api/categories/" + categoryToDelete, { withCredentials: true });
      
      // Update both categories and sortedCategories
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category.category_id !== categoryToDelete);
        setSortedCategories(updatedCategories); // Ensure sorted categories is in sync
        return updatedCategories;
      });
  
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  

  const openDeleteModal = (category_id) => {
    setCategoryToDelete(category_id);
    setShowModal(true); // Show the confirmation modal
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

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
      <div className="pt-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max ml-16 ">
        <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">List of Categories</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer" onClick={() => handleSort("category_id")}>
                  ID🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer" onClick={() => handleSort("category_name")}>
                  Name🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer" onClick={() => handleSort("category_description")}>
                  Category Description🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer" onClick={() => handleSort("subcategory_count")}>
                  SubCategory Count🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer" onClick={() => handleSort("product_count")}>
                  Product Count🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories?.map((category) => (
                <tr key={category.category_id}>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{category.category_id}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{category.category_name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(category.category_description, 100)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{category.subcategory_count}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{category.product_count}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600  space-x-2">
                    {category.category_name !== "Unspecified" ? (
                      <>
                        <Link
                          to={"/editCategory/" + category.category_id}
                          className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm link-spacing"
                        >
                          <i className="bx bx-cog"></i>
                        </Link>
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

      {/* Confirmation Modal */}
      {showModal && (
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
