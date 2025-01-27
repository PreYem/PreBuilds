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
          if (!response.data) {
            setUserData(null); // No user logged in
          } else {
            setUserData(response.data); // Set user data if user is logged in
          }
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
          setUserData(null); // Assume no user logged in
        })
        .finally(() => {
          setLoading(false); // Set loading to false after API call is complete
        });
    };

    // Initial session data fetch
    fetchSessionData();

    // Set interval to check session data every 10 seconds (10000 ms)
    const interval = setInterval(fetchSessionData, 60000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return { userData, loading, setUserData };
};

export default useSession;