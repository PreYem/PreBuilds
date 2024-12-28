import React from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";
import { useState, useEffect } from "react";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import setTitle from "../../utils/DocumentTitle";

const AddCategory = ({ title, userData }) => {
  setTitle(title);
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useRoleRedirect(userData, ["Owner", "Admin"]);

  const [formData, setFormData] = useState({
    category_id: "",
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">Add Category</h1>
          <form onSubmit={handleSubmit}>
            {/* Category ID */}
            <div className="mb-6">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category ID :
              </label>
              <input
                type="number"
                name="category_id"
                id="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="A number between 1 and 20 indecating the category's order in the navigation bar."
              />
            </div>

            {/* Category Name */}
            <div className="mb-6">
              <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Name :
              </label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Enter the category name - must be different from other category names."
              />
            </div>

            {/* Category Description */}
            <div className="mb-6">
              <label htmlFor="category_desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Description :
              </label>
              <textarea
                name="category_desc"
                id="category_desc"
                value={formData.category_desc}
                onChange={handleChange}
                rows="6"
                className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Write a few lines describing the category."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
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
            <div className="mt-2">
              {successMessage && (
                <div className="text-green-600 dark:text-green-400 mb-4 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-md shadow-md">
                  {successMessage}
                </div>
              )}

              {databaseError && (
                <div className="text-red-600 dark:text-red-400 mb-4 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md">
                  {databaseError}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
