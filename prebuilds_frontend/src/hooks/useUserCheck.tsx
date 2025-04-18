import { useEffect } from "react";
import apiService from "../api/apiService";
import { useSessionContext } from "../context/SessionContext";
import useLogout from "../utils/useLogout";

const useUserCheck = () => {
  const { userData, setUserData } = useSessionContext();
  const logout = useLogout;

  useEffect(() => {
    if (!userData) return; // This prevents the hook from running if userData is null

    const interval = setInterval(() => {
      // Make sure userData and userData.user_id are available before the API call
      if (userData && userData.user_id) {
        apiService
          .get("/api/users/" + userData.user_id)
          .then((response) => {
            if (response.data?.exists === false || response.data?.user?.user_account_status === "Locked") {
              logout();
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              console.log("");
            } else {
              console.error("");
            }
          });
      }
    }, 60000); // Check every X seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userData, setUserData]);
};

export default useUserCheck;
