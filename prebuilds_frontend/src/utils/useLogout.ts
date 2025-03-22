import apiService from "../api/apiService";
import { useSessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const { setUserData } = useSessionContext();
  const navigate = useNavigate();  // Add navigation to redirect after logout

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await apiService.post("/api/logout", {});

      // Clear the token from localStorage
      localStorage.removeItem("prebuilds_auth_token");

      // Clear user data from context
      setUserData(null);

      // Redirect to the login page after logout
      navigate("/");  // You can change this to whatever page you want

      console.log(response.data.successMessage); // Optionally log success message for debugging
    } catch (error) {
      console.error("Error logging out:", error);

      // Optionally, show an error message or handle error in a more user-friendly way
    }
  };

  return handleLogout;
};

export default useLogout;
