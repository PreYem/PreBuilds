import React, { useState } from "react";
import setTitle from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";

const AddProduct = ({ title, userData }) => {
  setTitle(title);
  useRoleRedirect(userData, ["Owner", "Admin"]);
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [specs, setSpecs] = useState([]);

  const addSpecField = () => {
    setSpecs([...specs, { name: "", value: "" }]);
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 w-full">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Add Product</h2>
          <form onSubmit={null}>
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
                    required
                    className=" mt-1 p-2 w-2/3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {1} / {2}
                  </div>
                </div>

                <div className="mb-4 flex gap-4">
                  {/* Parent Category */}
                  <div className="flex-1">
                    <label htmlFor="category_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                      Parent Category Name*
                    </label>
                    <select
                      name="category_id"
                      className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>
                      {/* Filter and map the categories */}
                      {/* Here */}
                    </select>
                  </div>

                  {/* Parent Sub-Category */}
                  <div className="flex-1">
                    <label htmlFor="subcategory_id" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                      Parent Sub-Category Name*
                    </label>
                    <select
                      name="subcategory_id"
                      className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                    >
                      <option value="" disabled>
                        Select a Sub-Category
                      </option>
                      {/* Filter and map the sub-categories */}
                      {/* Here */}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Product Quantity */}
                  <div className="mb-4 flex-1">
                    <label htmlFor="product_quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity*
                    </label>
                    <input
                      placeholder="in DHs"
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
                      placeholder="in DHs"
                      type="number"
                      id="buying_price"
                      name="buying_price"
                      required
                      className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="mb-4 flex-1">
                    <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selling Price*
                    </label>
                    <input
                      placeholder="in DHs"
                      type="number"
                      id="selling_price"
                      name="selling_price"
                      required
                      className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="mb-4 flex-1">
                    <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price After Discount
                    </label>
                    <input
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

                {/* Product Visiblity */}
                <div className="mb-4">
                  <label htmlFor="product_visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Visiblity :
                  </label>
                  <select
                    name="product_visibility"
                    value="Visible"
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
                    Product Name*
                  </label>
                  <textarea
                    placeholder="Write a brief description of this product."
                    id="product_desc"
                    name="product_desc"
                    rows="5"
                    className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                  ></textarea>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {1} / {2}
                  </div>
                </div>

                {/* Product Specifications */}
                {/* Product Specifications */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Product Specifications</h3>
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-4 mb-2">
                      <input
                        type="text"
                        placeholder="Specification Name"
                        value={spec.name}
                        onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Specification Value"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button type="button" onClick={() => removeSpecField(index)} className="p-2 text-red-500 hover:text-red-700">
                        X
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSpecField} className="mt-2 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                    Add Specification
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
