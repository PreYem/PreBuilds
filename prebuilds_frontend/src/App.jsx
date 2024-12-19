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
import useSession from "./hooks/useSession";
import useUserCheck from "./hooks/useUserCheck";

const App = () => {
  const { userData, loading, setUserData } = useSession();
  useUserCheck(userData, setUserData);

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
                <Route path="/register" element={<Register userData={userData} setUserData={setUserData} title="Sign Up" />} />
                <Route path="/login" element={<Login userData={userData} setUserData={setUserData} title="Sign In" />} />
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
