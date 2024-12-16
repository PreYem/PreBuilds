import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiService from "../api/apiService";
import "boxicons/css/boxicons.min.css";

const UserButtons = ({ userD, setUserD }) => {
  const navigate = useNavigate();

  // Fetch session data if no user is set
  useEffect(() => {
    if (!userD) {
      apiService
        .get("/api/getSessionData", { withCredentials: true })
        .then((response) => {
          if (response.data?.user_firstname) {
            setUserD({
              firstname: response.data.user_firstname,
              lastname: response.data.user_lastname,
              role: response.data.user_role,
              id: response.data.user_id,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
        });
    }
  }, [userD]);

  useEffect(() => {
    if (userD) {
      console.log(userD);
      // userD.id
    }
  }, [userD]); // This will run whenever userD is updated

  const handleLogout = () => {
    apiService
      .post("/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUserD(null); // Clear user state
        localStorage.clear(); // Clear localStorage
        navigate("/"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {userD ? (
        // Show "Logout" button and user's name if user is logged in
        <div className="flex items-center space-x-2">
          <a href="User/User_ShoppingCart" className="flex items-center text-gray-300 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
            🛒 Shopping Cart
          </a>
          <a href="#" className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
            <span className="text-white font-medium">
              Currently Logged in as:
              <br />
              {userD.user_role === "Owner" && <span className="mr-1">👑</span>}
              {userD.user_role === "Admin" && <span className="mr-1">👔</span>}
              {userD.user_role === "Client" && <span className="mr-1">🙋</span>}
              {userD.user_firstname} {userD.user_lastname} - {userD.user_role}
            </span>
          </a>

          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none
          hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none
          transition duration-600 ease-in-out text-sm"
            onClick={handleLogout}
          >
            <i className="bx bxs-door-open"></i> Logout
          </button>
        </div>
      ) : (
        // Show "Login" and "Register" buttons if no user is logged in
        <div className="flex space-x-2">
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none
          hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none
          transition duration-600 ease-in-out text-sm"
            onClick={() => handleNavigation("/login")}
          >
            Login
          </button>
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none
          hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none
          transition duration-600 ease-in-out text-sm"
            onClick={() => handleNavigation("/register")}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButtons;
