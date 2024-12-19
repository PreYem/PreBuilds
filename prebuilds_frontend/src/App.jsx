import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";
import NotFound from "./pages/PageNotFound";
import Footer from "./components/Footer";
import apiService from "./api/apiService";

const App = () => {
  const [userData, setUserData] = useState(null); // Initial state is null to indicate no user logged in
  const [loading, setLoading] = useState(true); // Loading state to manage async fetching

  useEffect(() => {
    apiService
      .get("/api/getSessionData", { withCredentials: true })
      .then((response) => {
        if (!response.data) {
          setUserData(null); // No user logged in, set to null
        } else {
          setUserData(response.data); // Set the actual user data
        }
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
        setUserData(null); // In case of error, assume no user is logged in
        // Optionally handle session expire error here
      })
      .finally(() => {
        setLoading(false); // Stop loading when the request finishes
      });
  }, []); // Empty dependency array, runs only on component mount

  useEffect(() => {
    // Checking if the user still exists in the database or not, if not then we instantly log them out
    if (userData) {
      const interval = setInterval(() => {
        apiService
          .get("/api/users/show/" + userData.user_id, { withCredentials: true })
          .then((response) => {
            // Checking for exists in the response data
            console.log("does user exist? : " + userData.user_id);

            if (response.data.exists === false || response.data.user_status === "Locked") {
              setUserData(null); // Clear user data
              apiService
                .post("/api/logout", {}, { withCredentials: true })
                .then(() => {
                  console.log("Logged out successfully");
                  // Optionally handle redirection here
                })
                .catch((error) => {
                  console.error("Error logging out:", error);
                });
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              console.error("User not found, logging out...");
              setUserData(null); // Clear user data if the user doesn't exist
              apiService
                .post("/api/logout", {}, { withCredentials: true })
                .then(() => {
                  console.log("Logged out successfully");
                })
                .catch((error) => {
                  console.error("Error logging out:", error);
                });
            } else {
              console.error("Error checking user existence:", error);
            }
          });
      }, 60000); // Check every 60 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userData]); // Effect runs only when userData changes

  if (loading) {
    return;
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>;
  }

  return (
    <>
      <ThemeProvider>
        <Router>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white h-4/5 ">
            {/* Dark mode toggle button */}
            <header className="p-4">{/* DarkModeToggle would go here if you have it */}</header>

            {/* Top and Admin Navbar */}
            <TopNavbar userData={userData} setUserData={setUserData} />
            <AdminNavBar userData={userData} setUserData={setUserData} />

            {/* Main content container */}
            <div className="p-1 w-4/5 mx-auto  h-1/5 ">
              {/* Routes for different components */}
              <Routes>
                <Route path="/" element={<Home userData={userData} setUserData={setUserData} user_role={userData?.user_role} title="Home" />} />
                <Route path="/register" element={<Register userData={userData} setUserData={setUserData} title="Register" />} />
                <Route path="/login" element={<Login userData={userData} setUserData={setUserData} title="Login" />} />
                <Route path="*" element={<NotFound title="Page Not Found" />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
