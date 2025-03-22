import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import useCloseModal from "../../hooks/useCloseModal";
import { SubCategory } from "./SubCategoriesList";
import { AxiosError } from "axios";
import { Category } from "../categories/CategoriesList";
import { useCategories } from "../../context/Category-SubCategoryContext";
import { useNotification } from "../../context/GlobalNotificationContext";

interface Props {
  isOpen: boolean;
  subCategoryData: SubCategory;
  onClose: () => void;
  onSaveSuccess: (updatedSubCategory: SubCategory) => void;
}

const EditSubCategory = ({ isOpen, subCategoryData, onClose, onSaveSuccess }: Props) => {
  const { updateSubCategory, categories, loading } = useCategories();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<SubCategory>({ ...subCategoryData });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    console.log(formData);
    setIsSaving(true);
    try {
      const response = await apiService.put("/api/subcategories/" + formData.subcategory_id, formData);
      onSaveSuccess(response.data.updatedSubCategory);
      updateSubCategory(response.data.updatedSubCategory);

      showNotification(response.data.successMessage, "successMessage");

      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      } else {
        showNotification("An unexpected error occurred.", "databaseError");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useCloseModal(onClose);

  const maxNameCharCount = 30;
  const maxDescCharCount = 1500;

  return (
    <>
      <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-1/2 transition-all duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center ">Edit Sub-Category </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mt-4">
              <label htmlFor="subcategory_name" className="block text-gray-700 dark:text-gray-300 font-bold">
                Sub-Category Name :
              </label>
              <input
                name="subcategory_name"
                id="subcategory_name"
                type="text"
                value={formData.subcategory_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subcategory_name: e.target.value,
                  })
                }
                onInput={(e) => MaxCharacterFieldCount(e, maxNameCharCount)}
                className="w-1/4 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.subcategory_name.length} / {maxNameCharCount}{" "}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                Parent Category Name :
              </label>

              {/* Render select only when parentCategories are loaded */}
              {loading ? (
                <div className="flex-1 bg-black-700 mt-2  overflow-x-auto scroll-smooth relative">
                  <div className="flex space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <select
                  className="w-1/4 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                  name="category_id"
                  value={formData.parent_category_id ? `${formData.parent_category_id}|${formData.parent_category_name}` : ""}
                  onChange={(e) => {
                    const [id, name] = e.target.value.split("|");
                    setFormData((prev) => ({
                      ...prev,
                      parent_category_id: parseInt(id),
                      parent_category_name: name,
                    }));
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories
                    .filter((category) => category.category_name !== "Unspecified")
                    .map((category) => (
                      <option key={category.category_id} value={`${category.category_id}|${category.category_name}`}>
                        {category.category_name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="subcategory_desc" className="block text-gray-700 dark:text-gray-300 font-bold">
                Sub-Category Description :
              </label>
              <textarea
                name="subcategory_desc"
                id="subcategory_desc"
                value={formData.subcategory_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subcategory_description: e.target.value,
                  })
                }
                onInput={(e) => MaxCharacterFieldCount(e, maxDescCharCount)}
                className="w-full h-64 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.subcategory_description.length} / {maxDescCharCount}{" "}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="subcategory_display_order" className="block text-gray-700 dark:text-gray-300">
                <span className="font-bold">Display Order : </span>
                <em>(Indicates the order of sub-categories in the top navigation bar from top to bottom.)</em>
              </label>
              <input
                id="subcategory_display_order"
                name="subcategory_display_order"
                type="number"
                value={formData.subcategory_display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subcategory_display_order: Number(e.target.value),
                  })
                }
                className="w-1/6 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mt-6 flex justify-between items-center">
              {/* Buttons */}
              <div className="flex justify-end space-x-4 ml-auto">
                <button type="button" onClick={onClose} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`py-2 px-4 rounded text-white ${isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditSubCategory;
