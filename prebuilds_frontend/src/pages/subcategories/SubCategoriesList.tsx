import { useEffect, useState } from "react";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { truncateText } from "../../utils/TruncateText";
import EditSubCategory from "./EditSubCategory";
import { Link } from "react-router-dom";
import useCloseModal from "../../hooks/useCloseModal";
import DeleteModal from "../DeleteModal";
import useConfirmationCountdown from "../../hooks/useConfirmationCountdown";
import { useSessionContext } from "../../context/SessionContext";
import { useCategories } from "../../context/Category-SubCategoryContext";
import { useNotification } from "../../context/GlobalNotificationContext";
import { AxiosError } from "axios";

export interface SubCategory {
  subcategory_id: number;
  subcategory_name: string;
  subcategory_description: string;
  subcategory_display_order: number;
  parent_category_name: string;
  product_count: number;
  parent_category_id: number;
  category_id: number;
}

const SubCategoriesList = ({ title }: TitleType) => {
  setTitle(title);
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();

  const { deleteSubCategory } = useCategories();

  useRoleRedirect(["Owner", "Admin"]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState<SubCategory>();

  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SubCategory | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });

  const [subCategoryToDelete, setSubCategoryToDelete] = useState<number>();
  const [isClosing, setIsClosing] = useState(false);
  const [sortedSubCategories, setSortedSubCategories] = useState<SubCategory[]>([]);

  const countdown = useConfirmationCountdown(3, showDeleteModal);

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
    if (subCategoryToDelete !== undefined) {
      try {
        const response = await apiService.delete("/api/subcategories/" + subCategoryToDelete);

        showNotification(response.data.successMessage, "successMessage");

        setSubCategories((prevSubCategories) => {
          const updatedSubCategories = prevSubCategories.filter((subCategory) => subCategory.subcategory_id !== subCategoryToDelete);
          setSortedSubCategories(updatedSubCategories);
          return updatedSubCategories;
        });

        deleteSubCategory(subCategoryToDelete);
        closeDeleteModal();
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        } else {
          showNotification("An unexpected error occurred.", "databaseError");
        }
      }
    } else {
      console.error("Category to delete is not defined");
    }
  };

  const openDeleteModal = (subcategory: SubCategory) => {
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

  useCloseModal(closeDeleteModal);

  const handleSort = (key: keyof SubCategory) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });

    const sorted = [...subCategories].sort((a, b) => {
      if (a[key] < b[key]) return newDirection === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedSubCategories(sorted);
  };

  const openEditModal = (subCategory: SubCategory) => {
    console.log(subCategory);

    setSubCategoryToEdit(subCategory);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveSuccess = (updatedSubCategory: SubCategory) => {
    setSubCategories((prevSubCategories) =>
      prevSubCategories.map((subcat) => (subcat.subcategory_id === updatedSubCategory.subcategory_id ? { ...subcat, ...updatedSubCategory } : subcat))
    );
    setSortedSubCategories((prevSorted) =>
      prevSorted.map((subcat) => (subcat.subcategory_id === updatedSubCategory.subcategory_id ? { ...subcat, ...updatedSubCategory } : subcat))
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Function to navigate to subcategory detail page


  return (
    <>
      <div className="pt-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max mb-8">
        <h1
          className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-200 text-center bg-gradient-to-r 
                from-blue-500 to-purple-500 dark:from-purple-500 dark:to-blue-500 text-transparent bg-clip-text  p-2 rounded-md
                border-1 "
        >
          Sub-Categories Dashboard
        </h1>

        {/* Sticky Navigation Buttons */}
        <div
          className="flex flex-wrap justify-center items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg 
        transition-transform duration-1000 max-w-3xl mx-auto sticky top-20 "
        >
          <Link
            className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-1000"
            to="/AddSubCategory"
          >
            <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
            <i className="bx bxs-add-to-queue"></i> Add Sub-Category
          </Link>
          <Link
            className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
            to="/AddCategory"
          >
            <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
            <i className="bx bxs-add-to-queue"></i> Add Category
          </Link>
          <Link
            className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-purple-500 dark:to-purple-700 text-white text-xs font-medium rounded-md overflow-hidden shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 dark:hover:from-purple-600 dark:hover:to-purple-800 transition-all duration-300"
            to="/CategoriesList"
          >
            <span className="absolute inset-0 w-0 bg-purple-200 opacity-20 group-hover:w-full group-hover:transition-all duration-1000"></span>
            <i className="bx bx-list-ul"></i> Categories List
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
                <th
                  className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm"
                  onClick={() => handleSort("subcategory_display_order")}
                >
                  Display Order🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" onClick={() => handleSort("subcategory_name")}>
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
                {userData?.user_role === "Owner" && <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>}
              </tr>
            </thead>
            <tbody>
              {sortedSubCategories?.map((subCategory, index) => (
                <tr
                  key={subCategory.subcategory_id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                  } hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer`}
                >
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    <Link to={`/s-${subCategory.subcategory_id}-${subCategory.subcategory_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                      {subCategory.subcategory_display_order}
                      
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    <Link to={`/s-${subCategory.subcategory_id}-${subCategory.subcategory_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                      {subCategory.subcategory_name}
                      
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    <Link to={`/s-${subCategory.subcategory_id}-${subCategory.subcategory_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                      {truncateText(subCategory.subcategory_description,100)}
                      
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    <Link to={`/s-${subCategory.subcategory_id}-${subCategory.subcategory_name.replace(/\s+/g, "")}`} className="block w-full h-full">
                      {subCategory.parent_category_name}

                      
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.product_count}</td>
                  {userData?.user_role === "Owner" && (
                    <td className="py-2 px-4 border-b dark:border-gray-600 space-x-2">
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Sub-Category Modal */}
      {showEditModal && subCategoryToEdit && (
        <EditSubCategory isOpen={showEditModal} subCategoryData={subCategoryToEdit} onClose={closeEditModal} onSaveSuccess={handleSaveSuccess} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showModal={showDeleteModal}
        isClosing={isClosing}
        countdown={countdown}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDeleteSubCategory}
        target={"Sub-Categoy"}
        disclaimer={
          <>
            <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> All Products under this Sub-Category will be moved to
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {" "}
              {"<"}Unspecified{">"}{" "}
            </span>
            Sub-Category.
          </>
        }
      />
    </>
  );
};

export default SubCategoriesList;
