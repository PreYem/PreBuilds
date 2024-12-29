import React from "react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";
import { useState, useEffect } from "react";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import setTitle from "../../utils/DocumentTitle";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";

const AddCategory = ({ title, userData }) => {
  setTitle(title);
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useRoleRedirect(userData, ["Owner", "Admin"]);

  const [formData, setFormData] = useState({
    category_display_order: "",
    category_name: "",
    category_desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setDatabaseError("");

    try {
      const response = await apiService.post("/api/categories/", formData);

      if (response.status === 201) {
        setSuccessMessage(response.data.successMessage);
        console.log(response.data.category);
      }
    } catch (error) {
      if (error.response) {
        setDatabaseError(error.response.data.databaseError);
        console.log(error.response.data);
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
                onChange={(e) => {
                  handleChange(e);
                }}
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
              <label htmlFor="category_desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Category Description :
              </label>
              <textarea
                name="category_desc"
                id="category_desc"
                value={formData.category_desc}
                onChange={(e) => {
                  handleChange(e);
                }}
                onInput={(e) => MaxCharacterFieldCount(e, maxDescChartCount)}
                rows="6"
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Write a few lines describing the category."
              ></textarea>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.category_desc.length} / {maxDescChartCount}
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
                onChange={handleChange}
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
