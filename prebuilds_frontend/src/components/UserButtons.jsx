import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserButtons = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Store user data to check if logged in

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/session", { withCredentials: true })
      .then((response) => {
        if (response.data.user_firstname) {
          // User is logged in, set user data in state
          setUser({
            firstname: response.data.user_firstname,
            role: response.data.user_role,
            id: response.data.user_id,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:8000/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null); // Clear user data after logout
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div>
        {user ? (
          // If the user is logged in, show "Logout" button
          <button
            className="px-6 py-2 bg-transparent text-white rounded-lg shadow-none
          hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none
          transition duration-600 ease-in-out"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          // If the user is not logged in, show "Login" and "Register" buttons
          <div className="flex">
            <button
              className="px-6 py-2 bg-transparent text-white rounded-lg shadow-none
            hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none
            transition duration-600 ease-in-out"
              onClick={() => handleNavigation("/login")}
            >
              Login
            </button>

            <button
              className="px-6 py-2 bg-transparent text-white rounded-lg shadow-none
            hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none
            transition duration-600 ease-in-out"
              onClick={() => handleNavigation("/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserButtons;
