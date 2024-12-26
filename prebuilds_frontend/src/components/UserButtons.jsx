import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../api/apiService";
import "boxicons/css/boxicons.min.css";
import ShoppingCart from "./ShoppingCart";

const UserButtons = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService
      .post("/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUserData(null);

        navigate("/"); // Redirect to the front page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

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
          <ShoppingCart userData={userData} />
          <Link className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium" to={"/editUser/" + userData.user_id}>
            <span className="text-white font-medium">
              Logged in as:
              <br />
              {userData?.user_role === "Owner" && (
                <span className="mr-1">
                  <i className="bx bxs-crown bx-flashing" style={{ color: "#f0ff00" }}></i>
                </span>
              )}
              {userData?.user_role === "Admin" && (
                <span className="mr-1">
                  <i className="bx bxs-briefcase bx-flashing" style={{ color: "#27ff00" }}></i>
                </span>
              )}
              {userData?.user_role === "Client" && (
                <span className="mr-1">
                  <i className="bx bx-user-pin"></i>
                </span>
              )}
              {userData?.user_firstname?.length > 10 ? userData.user_firstname.slice(0, 10) + "..." : userData.user_firstname}
            </span>
          </Link>

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
