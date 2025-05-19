import { useNavigate, useParams } from "react-router-dom";
import { TitleType } from "../../utils/DocumentTitle";
import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { Product } from "../../components/ProductCard";
import { AxiosError } from "axios";
import { useSessionContext } from "../../context/SessionContext";
import { useNotification } from "../../context/GlobalNotificationContext";

const ProductPage = ({ title }: TitleType) => {
  const { product_string } = useParams();
  const navigate = useNavigate();
  const { userData } = useSessionContext();

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

      navigate("*");
      return;
    }
  };

  useEffect(() => {
    if (product_id !== undefined) {
      fetchSingleProduct(product_id);
    }
  }, [product_id]);

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Product Details</h1>

        {/* Your other product details go here */}
        <div className="mt-4">Additional product details will appear here</div>
        <div className="mt-4">Additional product details will appear here</div>
        <div className="mt-4">Additional product details will appear here</div>
        <div className="mt-4">Additional product details will appear here</div>
        <div className="mt-4">Additional product details will appear here</div>
        <div> {JSON.stringify(product)} </div>
      </div>
    </>
  );
};

export default ProductPage;
