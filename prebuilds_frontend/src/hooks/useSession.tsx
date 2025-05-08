import { useState, useEffect } from "react";
import apiService from "../api/apiService";

export interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_phone: string
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
            Authorization: "Bearer" + token, // Send the token in the Authorization header
          },
        });

        
        setUserData(response.data.userData || null);
      } catch (error) {
        // console.error("Error fetching session data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();

  }, []);

  return { userData, loading, setUserData };
};

export default useSession;
