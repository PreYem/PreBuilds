import { useNavigate, useParams } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { Product } from "../../components/ProductCard";
import { AxiosError } from "axios";
import { useSessionContext } from "../../context/SessionContext";
import { useNotification } from "../../context/GlobalNotificationContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../api/apiConfig";
import { PriceFormat } from "../../utils/PriceFormat";

const ProductPage = () => {
  const { userData } = useSessionContext();

  const { product_string } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [product_id, setProduct_id] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (!product_string) {
      navigate("*", { replace: true });
      return;
    }
    const idStr = product_string.split("-")[0];
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
      navigate("*", { replace: true });
      return;
    }

    setProduct_id(id);
  }, [product_string, navigate]);

  const fetchSingleProduct = async (product_id: number) => {
    setLoading(true);
    try {
      const response = await apiService.get("/api/products/" + product_id);
      const { product, specs } = response.data;

      if (!product) {
        showNotification("Product not found or unavailable.", "databaseError");
        navigate("*", { replace: true });
        return;
      }

      const FullProduct: Product = {
        ...product,
        specs: specs,
      };
      setProduct(FullProduct);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
      navigate("*", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  setTitle(product?.product_name);

  useEffect(() => {
    if (product_id !== undefined) {
      fetchSingleProduct(product_id);
    }
  }, [product_id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto px-4 py-8  ">
      {/* Main Product Section */}
      <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md max-w-[1600px] mt-10 mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: image with product name overlay */}
          <div className="md:w-1/2 relative">
            {product?.product_picture ? (
              <>
                {/* Product Name Overlay */}
                <div className="absolute top-2 left-2 text-gray-800 dark:text-white text-xl font-bold px-2 py-1 rounded">{product.product_name}</div>

                {/* Discount Sticker */}
                {product.discount_price && product.selling_price && product.discount_price > 0 && (
                  <span className="absolute top-12 left-0 bg-yellow-600 text-white font-semibold px-3 py-1 rounded-lg shadow-md text-sm whitespace-nowrap">
                    <span className="block">
                      {Math.min(parseFloat((((product.selling_price - product.discount_price) / product.selling_price) * 100).toFixed(0)), 99)}% OFF
                    </span>
                    <span className="block">- {PriceFormat(product.selling_price - product.discount_price)} Dhs</span>
                  </span>
                )}

                {/* Status OFF Sticker */}
                {product.product_visibility === "Invisible" && (
                  <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg shadow-md ">
                    Status: OFF
                  </span>
                )}

                <img
                  src={BASE_API_URL + "/" + product.product_picture}
                  alt={product?.product_name}
                  className="rounded-lg shadow w-full object-contain max-h-[500px] mt-12"
                />
              </>
            ) : (
              <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Right side: product details */}
          <div className="md:w-1/2 flex flex-col">
            {/* Description container */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 flex-grow">
              <p className="text-gray-700 dark:text-gray-300">{product?.product_desc}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {/* Price & Availability */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline mb-0">
                  {product?.discount_price && product?.selling_price && product.discount_price > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{PriceFormat(product.discount_price)} Dhs</p>
                      <p className="text-lg text-gray-500 line-through ml-2">{PriceFormat(product.selling_price)} Dhs</p>
                      <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                        <i className="bx bxs-star-half bx-flashing mr-1" style={{ color: "orange" }}></i>ON SALE
                      </span>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{PriceFormat(product?.selling_price)} Dhs</p>
                  )}
                </div>

                <div>
                  {product?.product_quantity && product.product_quantity > 0 ? (
                    <span className="text-green-600 font-medium">In Stock ({product.product_quantity} available)</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-start">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center justify-center w-auto">
                  <i className="bx bx-cart text-xl mr-2"></i>
                  Add to Cart
                </button>
                {userData?.user_role !== "Client" && (
                  <button className="bg-green-500 text-white py-1 px-2 hover:bg-green-600 transition ease-in-out duration-300 text-sm rounded-lg w-10">
                    <i className="bx bxs-cog text-lg mt-1"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications table */}
        {product?.specs && product.specs.length > 0 && (
          <div className="mt-10 max-w-xl ml-auto">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Specifications</h2>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                    Specification
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.spec_name} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-200">{spec.spec_name}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{spec.spec_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Products Placeholder */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
