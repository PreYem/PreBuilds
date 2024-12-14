import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserButtons = ({ userD, setUserD }) => {
  const navigate = useNavigate();

  // Fetch session data if no user is set
  useEffect(() => {
    if (!userD) {
      axios
        .get("http://localhost:8000/api/getSessionData", { withCredentials: true })
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
    axios
      .post("http://localhost:8000/api/logout", {}, { withCredentials: true })
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
        <div className="flex items-center space-x-4">
          <a href="#">
            <span className="text-white font-medium">
              Currently Logged in As : <br />
              {userD.user_role === "Owner" && <span className="mr-1">👑</span>}
              {userD.user_role === "Admin" && <span className="mr-1">👔</span>}
              {userD.user_role === "Client" && <span className="mr-1">🙋</span>}
              {userD.user_firstname} {userD.user_lastname} - {userD.user_role}
            </span>
          </a>

          <button
            className="px-6 py-2 bg-transparent text-white rounded-lg shadow-none
          hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none
          transition duration-600 ease-in-out"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        // Show "Login" and "Register" buttons if no user is logged in
        <div className="flex space-x-4">
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
  );
};

export default UserButtons;
