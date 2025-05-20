import { useEffect, useState } from "react";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import { SubCategory } from "../subcategories/SubCategoriesList";
import { Category } from "../categories/CategoriesList";
import { AxiosError } from "axios";
import { Product } from "../../components/ProductCard";
import { useNotification } from "../../context/GlobalNotificationContext";

export interface Specs {
  spec_name: string;
  spec_value: string;
}

const AddProduct = ({ title }: TitleType) => {
  setTitle(title);
  const { showNotification } = useNotification(); // Get the showNotification function

  useRoleRedirect(["Owner", "Admin"]);
  const maxNameChartCount = 100;
  const maxDescChartCount = 1500;

  const initialFormDataValues = {
    product_id: 0,
    product_name: "",
    selling_price: 1,
    discount_price: 0,
    product_visibility: "Invisible",
    product_quantity: 0,
    category_id: 1,
    subcategory_id: 1,
    product_picture: null,
    specs: [],
    buying_price: 0,
    date_created: "",
    product_desc: "",
  };

  const [formData, setFormData] = useState(initialFormDataValues);

  const [loading, setLoading] = useState(true);

  const [specs, setSpecs] = useState<Specs[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);

  useEffect(() => {
    apiService
      .get("/api/NavBarCategories")
      .then((response) => {
        setParentCategories(response.data.categories);
        setSubCategories(response.data.subcategories);

        if (response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0].category_id);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setParentCategories([]);
        setSubCategories([]);
        setLoading(false);
      });
  }, []);

  const filteredSubCategories = subCategories.filter((subcategory) => subcategory.category_id == selectedCategory);

  const addSpecField = () => {
    setSpecs([...specs, { spec_name: "", spec_value: "" }]);
  };

  const handleSpecChange = (index: number, key: "spec_name" | "spec_value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][key] = value;
    setSpecs(newSpecs);
  };

  const removeSpecField = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const form = new FormData();

    form.append("product_name", formElement.product_name.value);
    form.append("category_id", (selectedCategory ?? "").toString());
    form.append("subcategory_id", formElement.subcategory_id.value);
    form.append("product_quantity", formElement.product_quantity.value);
    form.append("buying_price", formElement.buying_price.value);
    form.append("selling_price", formElement.selling_price.value);
    form.append("discount_price", formElement.discount_price.value);
    form.append("product_desc", formElement.product_desc.value);
    form.append("product_visibility", formElement.product_visibility.value);
    form.append("specs", JSON.stringify(specs));

    const fileInput = document.getElementById("imageInput") as HTMLInputElement;

    if (fileInput?.files?.length) {
      form.append("product_picture", fileInput.files[0]);
    }

    try {
      const response = await apiService.post("/api/products", form);

      if (response.status === 201) {
        showNotification(response.data.successMessage, "successMessage");

        setFormData(initialFormDataValues);
        setSpecs([]);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
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
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      onInput={(e) => MaxCharacterFieldCount(e, maxNameChartCount)}
                      required
                      className="mt-1 p-2 w-2/3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="text-sm text-gray-600 dark:text-gray-400 charCount">
                        {" "}
                        {formData.product_name.length} /{maxNameChartCount}
                      </div>
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
                          onChange={(e) => {
                            const categoryId = Number(e.target.value);
                            setSelectedCategory(categoryId);
                            setFormData((prevData) => ({
                              ...prevData,
                              category_id: categoryId,
                            }));
                          }}
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
                          onChange={(e) => {
                            const subcategoryId = Number(e.target.value);
                            setSelectedSubCategory(subcategoryId);
                            setFormData((prevData) => ({
                              ...prevData,
                              subcategory_id: subcategoryId,
                            }));
                          }}
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

                  <div className="flex flex-wrap gap-6 w-auto">
                    {/* Product Quantity */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="product_quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quantity*
                      </label>
                      <input
                        value={formData.product_quantity}
                        placeholder="Unit Count"
                        type="number"
                        id="product_quantity"
                        name="product_quantity"
                        onChange={(e) => setFormData({ ...formData, product_quantity: Number(e.target.value) })}
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Buying Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="buying_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Buying Price*
                      </label>
                      <input
                        value={formData.buying_price}
                        placeholder="in DHs"
                        step="0.01"
                        type="number"
                        id="buying_price"
                        name="buying_price"
                        onChange={(e) => setFormData({ ...formData, buying_price: Number(e.target.value) })}
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Selling Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selling Price*
                      </label>
                      <input
                        value={formData.selling_price}
                        placeholder="in DHs"
                        step="0.01"
                        type="number"
                        id="selling_price"
                        name="selling_price"
                        onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      />
                    </div>

                    {/* Discount Price */}
                    <div className="mb-4 flex-1">
                      <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        Price After Discount
                      </label>
                      <input
                        value={formData.discount_price}
                        placeholder="in DHs"
                        step="0.01"
                        type="number"
                        id="discount_price"
                        name="discount_price"
                        onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
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
                      value={formData.product_visibility}
                      onChange={(e) => setFormData({ ...formData, product_visibility: e.target.value })}
                      className="mt-1 w-1/4 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                    >
                      <option value={"Visible"}>Visible</option>
                      <option value={"Invisible"}>Invisible</option>
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
                      rows={5}
                      value={formData.product_desc}
                      onChange={(e) => setFormData({ ...formData, product_desc: e.target.value })}
                      onInput={(e) => MaxCharacterFieldCount(e, maxDescChartCount)}
                      className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    ></textarea>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="text-sm text-gray-600 dark:text-gray-400 charCount">
                        {" "}
                        {formData.product_desc.length} /{maxDescChartCount}
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  <div className="mb-4">
                    {specs.length > 0 && (
                      <div
                        className="space-y-2 max-h-52 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 
                      custom-scrollbar-glass"
                      >
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Specifications {"(" + specs.length + ")"}
                        </h3>
                        {specs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <input
                              type="text"
                              placeholder="Example: RAM"
                              required
                              value={spec.spec_name}
                              onInput={(e) => MaxCharacterFieldCount(e, 40)}
                              onChange={(e) => handleSpecChange(index, "spec_name", e.target.value)}
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />

                            <input
                              type="text"
                              placeholder="Example: 16GB"
                              required
                              value={spec.spec_value}
                              onInput={(e) => MaxCharacterFieldCount(e, 150)}
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

              {/* Submit Button */}
              <div className="flex justify-end mt-4 gap-4">
                <button
                  type="reset"
                  onClick={() => {
                    setFormData(initialFormDataValues);
                    setSpecs([]);
                  }}
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
