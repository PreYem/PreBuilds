import React, { useEffect, useRef, useState } from "react";
import setTitle from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";

const AddProduct = ({ title, userData }) => {
  setTitle(title);
  useRoleRedirect(userData, ["Owner", "Admin"]);
  const maxNameChartCount = 100;
  const maxDescChartCount = 1500;

  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);

  useEffect(() => {
    apiService
      .get("/api/NavBarCategories")
      .then((response) => {
        setParentCategories(response.data.categories);
        setSubCategories(response.data.subcategories);

        // Automatically set the selected category if data is available
        if (response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0].category_id);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setParentCategories([]);
        setSubCategories([]);
        setLoading(false); // Make sure to stop loading even in case of error
      });
  }, []);

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter((subcategory) => subcategory.category_id == selectedCategory);

  const addSpecField = () => {
    setSpecs([...specs, { spec_name: "", spec_value: "" }]);
  };

  const handleSpecChange = (index, key, value) => {
    const newSpecs = [...specs];
    newSpecs[index][key] = value;
    setSpecs(newSpecs);
  };

  const removeSpecField = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setDatabaseError("");

    const formData = new FormData();
    formData.append("product_name", e.target.product_name.value);
    formData.append("category_id", selectedCategory);
    formData.append("subcategory_id", e.target.subcategory_id.value);
    formData.append("product_quantity", e.target.product_quantity.value);
    formData.append("buying_price", e.target.buying_price.value);
    formData.append("selling_price", e.target.selling_price.value);
    formData.append("discount_price", e.target.discount_price.value);
    formData.append("product_desc", e.target.product_desc.value);
    formData.append("product_visibility", e.target.product_visibility.value);
    formData.append("specs", JSON.stringify(specs));
    const fileInput = document.getElementById("imageInput");
    if (fileInput.files.length > 0) {
      formData.append("product_picture", fileInput.files[0]);
    }

    console.log(formData);

    try {
      const response = await apiService.post("/api/products/", formData);

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

  const resetForm = () => {
    setSpecs([]);

    setFormData({});
  };

  const handleInputChange = (e, maxLength) => {
    const currentLength = MaxCharacterFieldCount(e, maxLength);

    // Get the corresponding character count span for this input
    const charCountDiv = e.target.closest("div").querySelector(".charCount"); // This will look for a div with class 'charCount' in the same parent div
    if (charCountDiv) {
      charCountDiv.textContent = currentLength + "/" + maxLength;
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full">
          <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Add Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {/* Product Name */}
                  <div className="mb-4">
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Name*
                    </label>
                    <input
                      placeholder="Example : RTX 2060"
                      type="text"
                      id="product_name"
                      name="product_name"
                      onInput={(e) => handleInputChange(e, maxNameChartCount)}
                      required
                      className="mt-1 p-2 w-2/3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="text-sm text-gray-600 dark:text-gray-400 charCount">0/{maxNameChartCount}</div>
                    </div>
                  </div>

                  <div className="mb-4 flex gap-4">
                    {/* Parent Category */}
                    <div className="flex-1">
                      <label htmlFor="category_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                        Parent Category Name*
                      </label>
                      {loading ? (
                        <LoadingSpinner />
                      ) : (
                        <select
                          name="category_id"
                          required
                          className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value={0} disabled>
                            Select a category
                          </option>
                          {parentCategories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Parent Sub-Category */}
                    <div className="flex-1">
                      <label htmlFor="subcategory_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                        Parent Sub-Category Name*
                      </label>
                      {loading ? (
                        <LoadingSpinner />
                      ) : (
                        <select
                          name="subcategory_id"
                          className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                        >
                          <option disabled>Select a Sub-Category</option>
                          {filteredSubCategories.map((subcategory) => (
                            <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                              {subcategory.subcategory_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Product Quantity */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="product_quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quantity*
                      </label>
                      <input
                        defaultValue={0}
                        placeholder="Unit Count"
                        type="number"
                        id="product_quantity"
                        name="product_quantity"
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Buying Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="buying_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Buying Price*
                      </label>
                      <input
                        defaultValue={0}
                        placeholder="in DHs"
                        type="number"
                        id="buying_price"
                        name="buying_price"
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Selling Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selling Price*
                      </label>
                      <input
                        defaultValue={0}
                        placeholder="in DHs"
                        type="number"
                        id="selling_price"
                        name="selling_price"
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Discount Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price After Discount
                      </label>
                      <input
                        defaultValue={0}
                        placeholder="in DHs"
                        type="number"
                        id="discount_price"
                        name="discount_price"
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Product Picture */}
                  <div className="mb-4">
                    <label htmlFor="product_picture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Picture :
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      className="mt-1 p-2 max-w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                  </div>

                  {/* Product Visibility */}
                  <div className="mb-4">
                    <label htmlFor="product_visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Visibility:
                    </label>
                    <select
                      name="product_visibility"
                      defaultValue="Visible"
                      className="mt-1 w-1/4 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                    >
                      <option value="Visible">Visible</option>
                      <option value="Invisible">Invisible</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Product Description */}
                  <div className="mb-4">
                    <label htmlFor="product_desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Description*
                    </label>
                    <textarea
                      placeholder="Write a brief description of this product."
                      id="product_desc"
                      name="product_desc"
                      rows="5"
                      onInput={(e) => handleInputChange(e, maxDescChartCount)}
                      className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    ></textarea>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="text-sm text-gray-600 dark:text-gray-400 charCount">0/{maxDescChartCount}</div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  <div className="mb-4">
                    {specs.length > 0 && (
                      <div className="space-y-2 max-h-52 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 
                      custom-scrollbar-glass">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Product Specifications</h3>
                        {specs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <input
                              type="text"
                              placeholder="Example: RAM"
                              required
                              value={spec.spec_name}
                              onInput={(e) => handleInputChange(e, 20)}
                              onChange={(e) => handleSpecChange(index, "spec_name", e.target.value)}
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />

                            <input
                              type="text"
                              placeholder="Example: 16GB"
                              required
                              value={spec.spec_value}
                              onInput={(e) => handleInputChange(e, 20)}
                              onChange={(e) => handleSpecChange(index, "spec_value", e.target.value)}
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button type="button" onClick={() => removeSpecField(index)} className="p-2 text-red-500 hover:text-red-700">
                              <i className="bx bxs-x-circle bx-flip-horizontal" style={{ color: "ff0a0a" }}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={addSpecField} className="mt-2 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                      Add Specification
                    </button>
                  </div>
                </div>
              </div>

              {successMessage && (
                <div className="max-w-80 text-sm text-green-600 dark:text-green-400 mb-4 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-md shadow-md">
                  {successMessage}
                </div>
              )}

              {databaseError && (
                <div className="max-w-80 text-sm text-red-600 dark:text-red-400 mb-4 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md">
                  {databaseError}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end mt-4 gap-4">
                <button
                  type="reset"
                  onClick={resetForm}
                  className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
