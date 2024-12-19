// src/hooks/useUserCheck.js
import { useEffect } from "react";
import apiService from "../api/apiService";

const useUserCheck = (userData, setUserData) => {
  useEffect(() => {
    if (!userData) return;

    const interval = setInterval(() => {
      apiService
        .get(`/api/users/show/${userData.user_id}`, { withCredentials: true })
        .then((response) => {
          if (response.data.exists === false || response.data.user_status === "Locked") {
            setUserData(null);
            apiService
              .post("/api/logout", {}, { withCredentials: true })
              .catch((error) => console.error("Error logging out:", error));
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setUserData(null);
            apiService
              .post("/api/logout", {}, { withCredentials: true })
              .catch((error) => console.error("Error logging out:", error));
          } else {
            console.error("Error checking user existence:", error);
          }
        });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userData, setUserData]);
};

export default useUserCheck;
