import { useEffect, useState } from "react";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AxiosError } from "axios";
import { Category } from "../categories/CategoriesList";
import { useCategories } from "../../context/Category-SubCategoryContext";

const AddSubCategory = ({ title }: TitleType) => {
  const { categories, addSubCategory } = useCategories(); // ✅ Use context data

  setTitle(title);
  const [databaseError, setDatabaseError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useRoleRedirect(["Owner"]);

  const [formData, setFormData] = useState({
    subcategory_id: 0,
    subcategory_name: "",
    category_id: 0,
    subcategory_description: "",
    subcategory_display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setDatabaseError("");

    console.log(formData);

    try {
      const response = await apiService.post("/api/subcategories/", formData);

      if (response.status === 201) {
        setSuccessMessage(response.data.successMessage);
        addSubCategory(response.data.newSubCategory);

        console.log(formData);

        console.log("_______");
        
        
        console.log(response.data.newSubCategory);
        
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setDatabaseError(error.response.data.databaseError || "An error occurred.");
      } else {
        setDatabaseError("An unexpected error occurred.");
      }
    }
  };
  const maxNameChartCount = 30;
  const maxDescChartCount = 1500;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">Add Sub-Category</h1>
          <form onSubmit={handleSubmit}>
            {/* Sub-Category Name */}
            <div className="mb-6">
              <label htmlFor="subcategory_name" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                Sub-Category Name :
              </label>
              <input
                type="text"
                name="subcategory_name"
                id="subcategory_name"
                value={formData.subcategory_name}
                onChange={(e) => setFormData({ ...formData, subcategory_name: e.target.value })}
                onInput={(e) => MaxCharacterFieldCount(e, maxNameChartCount)}
                required
                className="w-1/4 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter a sub-category name."
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.subcategory_name.length} / {maxNameChartCount}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                Parent Category Name :
              </label>

              {/* Render select only when parentCategories are loaded */}

              <select
                required
                className="w-1/4 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                name="category_id"
                value={formData.category_id || ""}
                onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
              >
                {/* Default placeholder option */}
                <option value="" disabled>
                  Select a category
                </option>

                {/* Filter and map the categories */}
                {categories
                  .filter((category) => category.category_name !== "Unspecified")
                  .map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sub-Category Description */}
            <div className="mb-6">
              <label htmlFor="subcategory_description" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Sub-Category Description :
              </label>
              <textarea
                name="subcategory_description"
                id="subcategory_description"
                value={formData.subcategory_description}
                onChange={(e) => setFormData({ ...formData, subcategory_description: e.target.value })}
                onInput={(e) => MaxCharacterFieldCount(e, maxDescChartCount)}
                rows={6}
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Write a few lines describing the sub-category."
              ></textarea>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.subcategory_description.length} / {maxDescChartCount}
              </div>
            </div>

            {/* Sub-Category Display Order */}
            <div className="mb-6">
              <label htmlFor="subcategory_display_order" className="block text-sm  text-gray-700 dark:text-gray-300">
                <span className="font-bold">Display Order : </span>
                <em>(Indicates the order of categories in the top navigation bar from top to bottom.)</em>
              </label>

              <input
                type="number"
                name="subcategory_display_order"
                id="subcategory_display_order"
                value={formData.subcategory_display_order}
                onChange={(e) => setFormData({ ...formData, subcategory_display_order: Number(e.target.value) })}
                className="w-1/6 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center">
              {successMessage && (
                <div className="text-sm text-green-600 dark:text-green-400 mb-4 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-md shadow-md">
                  {successMessage}
                </div>
              )}

              {databaseError && (
                <div className=" max-w-xl text-sm text-red-600 dark:text-red-400 mb-4 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md">
                  {databaseError}
                </div>
              )}
              <div className="flex justify-end space-x-4 ml-auto">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Sub-Category
                </button>
                <Link
                  to={"/SubCategoriesList"}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Close
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddSubCategory;
