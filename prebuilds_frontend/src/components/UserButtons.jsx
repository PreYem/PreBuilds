import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiService from "../api/apiService";
import "boxicons/css/boxicons.min.css";

const UserButtons = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  console.log("USERS BUTTONS : " + userData);

  // Fetch session data if no user is set

  const handleLogout = () => {
    apiService
      .post("/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUserData(null); // Clear user state

        navigate("/"); // Redirect to the front page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  // Add a check for userData before rendering
  if (!userData) {
    return (
      <div className="flex space-x-2">
        <button
          className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div>
      {userData?.user_id ? (
        // Show "Logout" button and user's name if user is logged in
        <div className="flex items-center space-x-2">
          <a
            href="User/User_ShoppingCart"
            className="flex items-center text-gray-300 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            🛒 Shopping Cart
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            <span className="text-white font-medium">
              Currently Logged in as:
              <br />
              {userData?.user_role === "Owner" && <span className="mr-1">👑</span>}
              {userData?.user_role === "Admin" && <span className="mr-1">👔</span>}
              {userData?.user_role === "Client" && <span className="mr-1">🙋</span>}
              {userData?.user_firstname} {userData?.user_lastname} - {userData?.user_role}
            </span>
          </a>

          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={handleLogout}
          >
            <i className="bx bxs-door-open"></i> Logout
          </button>
        </div>
      ) : (
        // Show "Login" and "Register" buttons if no user is logged in
        <div className="flex space-x-2">
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButtons;
