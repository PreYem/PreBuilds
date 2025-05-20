import { useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import { Category } from "./CategoriesList";
import { AxiosError } from "axios";
import { useCategories } from "../../context/Category-SubCategoryContext";
import { useNotification } from "../../context/GlobalNotificationContext";

type CategoryFormData = Omit<Category, "subcategory_count" | "product_count">;

const AddCategory = ({ title }: TitleType) => {
  const { showNotification } = useNotification();

  const { addCategory } = useCategories();

  setTitle(title);

  const initialFormDataValues = {
    category_id: 0,
    category_name: "",
    category_description: "",
    category_display_order: 0,
  };

  useRoleRedirect(["Owner"]);

  const [formData, setFormData] = useState<CategoryFormData>(initialFormDataValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await apiService.post("/api/categories", formData);

      if (response.status === 201) {
        showNotification(response.data.successMessage, "successMessage");
        addCategory(response.data.newCategory);
        console.log(response.data.newCategory);
        
        setFormData(initialFormDataValues);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    }
  };

  const maxNameChartCount = 15;
  const maxDescChartCount = 1500;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">Add Category</h1>
          <form onSubmit={handleSubmit}>
            {/* Category Name */}
            <div className="mb-6">
              <label htmlFor="category_name" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                Category Name :
              </label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                onInput={(e) => MaxCharacterFieldCount(e, maxNameChartCount)}
                required
                className="w-1/4 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter a category name."
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_name.length} / {maxNameChartCount}
              </div>
            </div>

            {/* Category Description */}
            <div className="mb-6">
              <label htmlFor="category_description" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Category Description :
              </label>
              <textarea
                name="category_descriptionription"
                id="category_description"
                value={formData.category_description}
                onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
                onInput={(e) => MaxCharacterFieldCount(e, maxDescChartCount)}
                rows={6}
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Write a few lines describing the category."
              ></textarea>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_description.length} / {maxDescChartCount}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category_display_order" className="block text-sm  text-gray-700 dark:text-gray-300">
                <span className="font-bold">Display Order : </span>
                <em>(Indicates the order of categories in the top navigation bar from left to right.)</em>
              </label>

              <input
                type="number"
                name="category_display_order"
                id="category_display_order"
                value={formData.category_display_order}
                onChange={(e) => setFormData({ ...formData, category_display_order: Number(e.target.value) })}
                className="w-1/6 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex justify-end space-x-4 ml-auto">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Category
                </button>
                <Link
                  to={"/CategoriesList"}
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

export default AddCategory;
