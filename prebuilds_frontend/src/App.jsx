import React from "react";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import DarkModeToggle from "./components/DarkModeToggle"; // Import DarkModeToggle component
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <Router>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white h-4/5 ">
            {/* Dark mode toggle button */}
            <header className="p-4">{/* DarkModeToggle would go here if you have it */}</header>

            {/* Top and Admin Navbar */}
            <TopNavbar />
            <AdminNavBar />

            {/* Main content container */}
            <div className="p-1 w-4/5 mx-auto bg-green-700 h-1/5 ">
              {/* Routes for different components */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
