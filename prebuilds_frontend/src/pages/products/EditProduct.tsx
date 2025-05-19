import { useEffect, useRef, useState } from "react";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../api/apiConfig";
import useCloseModal from "../../hooks/useCloseModal";
import { Product } from "../../components/ProductCard";
import { SubCategory } from "../subcategories/SubCategoriesList";
import { AxiosError } from "axios";
import { Category } from "../categories/CategoriesList";
import { Specs } from "./AddProduct";
import { useNotification } from "../../context/GlobalNotificationContext";

interface Props {
  isOpen: boolean;
  productData: Product;
  onClose: () => void;
  onSaveSuccess: (updatedProduct: Product) => void;
}

const EditProduct = ({ isOpen, productData, onClose, onSaveSuccess }: Props) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<Product>({ ...productData });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [specs, setSpecs] = useState<Specs[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Initialize selectedCategory with productData.category_id or a fallback value of 0
  const [selectedCategory, setSelectedCategory] = useState<number>(productData.category_id || 0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(productData.subcategory_id);
  const modalRef = useRef<HTMLDivElement>(null);

  const maxNameCharCount = 100;
  const maxDescCharCount = 1500;

  const filteredSubCategories = subCategories.filter((subcategory) => subcategory.category_id == selectedCategory);

  const imageInput = useRef(null);

  useEffect(() => {
    apiService
      .get("/api/NavBarCategories")
      .then((response) => {
        setParentCategories(response.data.categories);
        setSubCategories(response.data.subcategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setParentCategories([]);
        setSubCategories([]);
        setLoading(false);
      });
  }, []);

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

  // Fetching Full Product Specs as well as any additional data needed
  useEffect(() => {
    apiService
      .get("/api/products/" + productData.product_id)
      .then((response) => {
        setSpecs(response.data.specs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        showNotification("An unexpected error has occurred", "databaseError");
        setLoading(false);
      });
  }, []);

  useCloseModal(modalRef, onClose);

  useEffect(() => {
    setFormData({ ...formData, specs: specs });
  }, [specs]);

  // Handling Sending Data to the backend for processing and confirmation
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const form = new FormData();

    form.append("_method", "PUT");
    form.append("product_name", formElement.product_name.value);
    
    // Add a safety check before converting to string
    const categoryId = selectedCategory || formData.category_id || 0;
    form.append("category_id", categoryId.toString());
    form.append("subcategory_id", formElement.subcategory_id.value);
    form.append("product_quantity", formElement.product_quantity.value);
    form.append("buying_price", formElement.buying_price.value);
    form.append("selling_price", formElement.selling_price.value);
    form.append("discount_price", formElement.discount_price.value);
    form.append("product_desc", formElement.product_desc.value);
    form.append("product_visibility", formData.product_visibility);
    form.append("specs", JSON.stringify(specs));

    const fileInput = document.getElementById("imageInput") as HTMLInputElement;

    if (fileInput?.files?.length) {
      form.append("product_picture", fileInput.files[0]);
    }

    try {
      const response = await apiService.post("/api/products/" + productData.product_id, form);
      console.log(form);
      

      setFormData((prevFormData) => ({
        ...prevFormData,
        product_picture: response.data.product_picture,
      }));

      onSaveSuccess({
        ...formData,
        product_picture: response.data.product_picture,
      });
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

  if (loading) {
    return (
      <>
        <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 h-full p-8 rounded-lg w-2/3 transition-all duration-300 ease-in-out">
            <LoadingSpinner />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-10/12 transition-all duration-300 ease-in-out" ref={modalRef}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center ">Edit Product ID : {productData.product_id} </h3>
          <form onSubmit={handleSave}>
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
                    defaultValue={productData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    onInput={(e) => MaxCharacterFieldCount(e, maxNameCharCount)}
                    required
                    className="mt-1 p-2 w-2/3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="text-sm text-gray-600 dark:text-gray-400 charCount">
                      {" "}
                      {formData.product_name.length} /{maxNameCharCount}
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
                        defaultValue={formData.category_id}
                        name="category_id"
                        required
                        className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        onChange={(e) => {
                          const newCategory = Number(e.target.value);
                          setSelectedCategory(newCategory);
                          setFormData({
                            ...formData,
                            category_id: newCategory,
                            subcategory_id: null as unknown as number,
                          });
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
                        defaultValue={productData.subcategory_id}
                        name="subcategory_id"
                        className="mt-1 w-10/12 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        onChange={(e) => {
                          setSelectedSubCategory(Number(e.target.value));
                          setFormData({ ...formData, subcategory_id: Number(e.target.value) });
                        }}
                      >
                        <option value={""} disabled>
                          Select a Sub-Category
                        </option>
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
                      defaultValue={productData.product_quantity}
                      onChange={(e) => setFormData({ ...formData, product_quantity: Number(e.target.value) })}
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
                      defaultValue={productData.buying_price}
                      onChange={(e) => setFormData({ ...formData, buying_price: Number(e.target.value) })}
                      placeholder="in DHs"
                      type="number"
                      step="0.01"
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
                      defaultValue={productData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                      placeholder="in DHs"
                      step="0.01"
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
                      defaultValue={productData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                      placeholder="in DHs"
                      step="0.01"
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
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setFormData({
                        ...formData,
                        product_picture: file,
                      });
                    }}
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    ref={imageInput}
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
                    onChange={(e) => setFormData({ ...formData, product_visibility: e.target.value })}
                    defaultValue={productData.product_visibility}
                    className="mt-1 w-1/4 border border-gray-300 dark:border-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                  >
                    <option value="Visible">Visible</option>
                    <option value="Invisible">Invisible</option>
                  </select>
                </div>

                <img
                  src={BASE_API_URL + "/" + productData.product_picture}
                  alt={productData.product_name}
                  className="w-52 max-h-52 object-cover object-center rounded-md"
                />
              </div>

              {/* Right Column */}
              <div>
                {/* Product Description */}
                <div className="mb-4">
                  <label htmlFor="product_desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Description*
                  </label>
                  <textarea
                    onChange={(e) => setFormData({ ...formData, product_desc: e.target.value })}
                    defaultValue={productData.product_desc}
                    placeholder="Write a brief description of this product."
                    id="product_desc"
                    name="product_desc"
                    rows={6}
                    onInput={(e) => MaxCharacterFieldCount(e, maxDescCharCount)}
                    className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                  ></textarea>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="text-sm text-gray-600 dark:text-gray-400 charCount">
                      {" "}
                      {formData.product_desc.length} /{maxDescCharCount}
                    </div>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="mb-4">
                  {specs.length > 0 && (
                    <div className="space-y-2 max-h-52 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Product Specifications</h3>
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
          {/* {JSON.stringify(formData)} */}
          {/* {JSON.stringify(formElement)} */}
        </div>
      </div>
    </>
  );
};

export default EditProduct;