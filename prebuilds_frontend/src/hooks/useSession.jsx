import { useState, useEffect } from "react";
import apiService from "../api/apiService";

const useSession = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = () => {
      apiService
        .get("/api/getSessionData", { withCredentials: true })
        .then((response) => {
          setUserData(response.data || null); // Set user data if available
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
          setUserData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchSessionData();

    // Refresh session data every 60 seconds
    const interval = setInterval(fetchSessionData, 60000);

    return () => clearInterval(interval);
  }, []);

  return { userData, loading, setUserData }; // Provide setUserData for updates
};

export default useSession;
