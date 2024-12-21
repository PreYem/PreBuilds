
import apiService from "../api/apiService";

export const deleteProduct = async (productId, onDelete) => {
  try {
    await apiService.delete(`/api/products/${productId}`, { withCredentials: true });
    if (onDelete) {
      onDelete(productId);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
