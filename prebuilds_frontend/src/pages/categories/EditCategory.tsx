import React, { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import useCloseModal from "../../hooks/useCloseModal";
import { Category } from "./CategoriesList";
import { AxiosError } from "axios";
import { useCategories } from "../../context/Category-SubCategoryContext";
import { useNotification } from "../../context/GlobalNotificationContext";

interface Props {
  isOpen: boolean;
  categoryData: Category;
  onClose: () => void;
  onSaveSuccess: (formData: Category) => void;
}

const EditCategory = ({ isOpen, categoryData, onClose, onSaveSuccess }: Props) => {
  const { updateCategory } = useCategories(); // ✅ Use context data
  const { showNotification } = useNotification();

  useCloseModal(onClose);

  const [formData, setFormData] = useState({ ...categoryData });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiService.put("/api/categories/" + formData.category_id, formData);

      showNotification(response.data.successMessage, "successMessage");

      onSaveSuccess(response.data.updatedCategory);
      updateCategory(response.data.updatedCategory);
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

  // Custom Hook to close modal.

  const maxNameCharCount = 15;
  const maxDescCharCount = 1500;

  // Limiting the amount of characters that can be typed into the field

  return (
    <>
      <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-1/2 transition-all duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center ">Edit Category </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mt-4">
              <label htmlFor="category_name" className="block text-gray-700 dark:text-gray-300 font-bold">
                Category Name :
              </label>
              <input
                name="category_name"
                id="category_name"
                type="text"
                value={formData.category_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_name: e.target.value,
                  })
                }
                onInput={(e) => MaxCharacterFieldCount(e, maxNameCharCount)}
                className="w-1/4 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_name.length} / {maxNameCharCount}{" "}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="category_desc" className="block text-gray-700 dark:text-gray-300 font-bold">
                Category Description :
              </label>
              <textarea
                name="category_desc"
                id="category_desc"
                value={formData.category_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_description: e.target.value,
                  })
                }
                onInput={(e) => MaxCharacterFieldCount(e, maxDescCharCount)}
                className="w-full h-64 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_description.length} / {maxDescCharCount}{" "}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="category_display_order" className="block text-gray-700 dark:text-gray-300">
                <span className="font-bold">Display Order : </span>
                <em>(Indicates the order of categories in the top navigation bar from left to right.)</em>
              </label>
              <input
                id="category_display_order"
                name="category_display_order"
                type="number"
                value={formData.category_display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_display_order: Number(e.target.value),
                  })
                }
                className="w-1/6 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mt-6 flex justify-between items-center">
              {/* Error message container */}

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

export default EditCategory;
