import { useParams } from "react-router-dom";
import { TitleType } from "../../utils/DocumentTitle";

const ProductPage = ({title}: TitleType) => {
  // Access the URL parameters
  const { product_id, product_name } = useParams();
  console.log("ProductPage rendering, params:", useParams());
  
  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Product Details</h1>
        <div className="mb-2">Product ID: {product_id}</div>
        <div className="mb-2">Product Name: {product_name}</div>
        
        {/* Your other product details go here */}
        <div className="mt-4">Additional product details will appear here</div>
      </div>
    </>
  );
};

export default ProductPage;