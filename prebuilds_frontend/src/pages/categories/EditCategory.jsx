import React, { useState } from "react";
import apiService from "../../api/apiService";

const EditCategory = ({ isOpen, categoryData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({ ...categoryData });
  const [isSaving, setIsSaving] = useState(false);
  const [databaseError, setDatabaseError] = useState(null);

  
  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setDatabaseError("");
    try {
      await apiService.put("/api/categories/" + formData.category_id, formData, {
        withCredentials: true,
      });
      onSaveSuccess(formData);
      onClose();
    } catch (error) {
      setDatabaseError(error.response.data.databaseError);
      console.error("Error updating category:", error.response.data.databaseError);
    } finally {
      setIsSaving(false);
    }
  };

  const maxNameCharCount = 15;
  const maxDescCharCount = 1500;

  // Limiting the amount of characters that can be typed into the field
  const setMaxNameChartCount = (e) => {
    const newCategoryName = e.target.value; // Value to change
    if (newCategoryName.length <= maxNameCharCount) {
      setFormData({ ...formData, category_name: newCategoryName });
    }
  };

  // Limiting the amount of characters that can be typed into the field
  const setMaxDesccriptionChartCount = (e) => {
    const newCategoryDescription = e.target.value;
    // Value to change
    if (newCategoryDescription.length <= maxDescCharCount) {
      setFormData({ ...formData, category_description: newCategoryDescription });
    }
  };

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
              <label htmlFor="category_name" className="block text-gray-700 dark:text-gray-300">
                Name :
              </label>
              <input
                name="category_name"
                id="category_name"
                type="text"
                value={formData.category_name}
                onChange={setMaxNameChartCount}
                className="w-1/4 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_name.length} / {maxNameCharCount}{" "}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="category_desc" className="block text-gray-700 dark:text-gray-300">
                Description :
              </label>
              <textarea
                name="category_desc"
                id="category_desc"
                value={formData.category_description}
                onChange={setMaxDesccriptionChartCount}
                className="w-full h-64 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_description.length} / {maxDescCharCount}{" "}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="category_display_order" className="block text-gray-700 dark:text-gray-300">
                Display Order :
              </label>
              <input
                id="category_display_order"
                name="category_display_order"
                type="number"
                value={formData.category_display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_display_order: e.target.value,
                  })
                }
                className="w-1/12 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div className="mt-6 flex justify-between items-center">
              {/* Error message container */}
              {databaseError && (
                <div className=" text-sm text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md max-w-[70%]">
                  {databaseError}
                </div>
              )}

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
