// src/hooks/useSession.js
import { useState, useEffect } from "react";
import apiService from "../api/apiService";

const useSession = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .get("/api/getSessionData", { withCredentials: true })
      .then((response) => {
        if (!response.data) {
          setUserData(null); // No user logged in
        } else {
          setUserData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
        setUserData(null); // Assume no user logged in
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { userData, loading, setUserData };
};

export default useSession;