import { useState, useEffect } from "react";
import apiService from "../api/apiService";

export interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_phone: string;
  user_address: string;
  user_account_status: string;
}

const useSession = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("prebuilds_auth_token");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await apiService.get("/api/getSessionData", {
          headers: {
            Authorization: "Bearer " + token, // Ensure there's a space after "Bearer"
          },
        });

        if (response.data.userData.user_account_status === "Locked") {
          setUserData(null);
        }

        if (response.data.userData.user_account_status === "Unlocked") {
          setUserData(response.data.userData || null);
        }

        console.log(response.data.userData);
      } catch (error) {
        // console.error("Error fetching session data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch session data immediately when the component mounts
    fetchSessionData();

    // Set up interval to refetch data every 60 seconds
    const interval = setInterval(fetchSessionData, 60000); // 60000 ms = 60 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [token]); // Add token as a dependency so it gets updated when token changes

  return { userData, loading, setUserData };
};

export default useSession;
