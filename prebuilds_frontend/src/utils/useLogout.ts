import apiService from "../api/apiService";
import { useSessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const { setUserData } = useSessionContext();
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      const response = await apiService.post("/api/logout", {});

      localStorage.removeItem("prebuilds_auth_token");

      setUserData(null);

      navigate("/");

      console.log(response.data.successMessage);
    } catch (error) {
      console.error("Error logging out:", error);

    }
  };

  return handleLogout;
};

export default useLogout;
