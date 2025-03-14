import { useState, useEffect } from "react";
import apiService from "../api/apiService";

// Define the UserData type
interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
}

const useSession = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await apiService.get("/api/getSessionData", { withCredentials: true });
        setUserData(response.data || null);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
    // Refresh session data every 60 seconds
    const interval = setInterval(fetchSessionData, 60000);
    return () => clearInterval(interval);
  }, []);

  return { userData, loading, setUserData };
};

export default useSession;