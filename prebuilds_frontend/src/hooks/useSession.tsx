import { useState, useEffect } from "react";
import apiService from "../api/apiService";

// Define the UserData type
export interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_username: string;
  user_country: string;
  user_email: string;
  user_registration_date: string;
  user_last_logged_at: string;
  user_account_status: string;
  user_phone: string;
  user_address: string;
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
