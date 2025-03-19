import { useNavigate } from "react-router-dom";
import apiService from "../api/apiService";
import { useSessionContext } from "../context/SessionContext";

const useLogout = () => {
  const { setUserData } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiService.post("/api/logout", {}, { withCredentials: true });

      setUserData(null);

    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return handleLogout;
};

export default useLogout;
