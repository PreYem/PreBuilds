import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import DarkModeToggle from "./components/DarkModeToggle"; // Import DarkModeToggle component
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";
import axios from "axios";
import NotFound from "./pages/PageNotFound";

const App = () => {
  const [userData, setUserData] = useState(localStorage.getItem("User") ? JSON.parse(localStorage.getItem("User")) : null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/getSessionData", { withCredentials: true })
      .then((response) => {
        if (!response.data) {
          setUserData(null);
          localStorage.removeItem("User");
        }
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
        // Optionally handle expired session on error
        handleSessionExpire();
      });
  }, []);

  return (
    <>
      <ThemeProvider>
        <Router>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white h-4/5 ">
            {/* Dark mode toggle button */}
            <header className="p-4">{/* DarkModeToggle would go here if you have it */}</header>

            {/* Top and Admin Navbar */}
            <TopNavbar userD={userData} setUserD={setUserData} />
            <AdminNavBar userD={userData} setUserD={setUserData} />

            {/* Main content container */}
            <div className="p-1 w-4/5 mx-auto bg-green-700 h-1/5 ">
              {/* Routes for different components */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login userD={userData} setUserD={setUserData} />} />{" "}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
