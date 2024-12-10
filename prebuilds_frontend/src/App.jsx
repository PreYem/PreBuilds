import React from "react";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import DarkModeToggle from "./components/DarkModeToggle"; // Import DarkModeToggle component
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";

const App = () => {
  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Dark mode toggle button */}
        <header className="p-4">
          <DarkModeToggle />
        </header>

        {/* Top and Admin Navbar */}
        <TopNavbar />
        <AdminNavBar />

        {/* Main content container with a green background */}
        <div className="p-1 w-4/5 mx-auto bg-green-700">
          {/* Content goes here */}

          <Register />

          {/* Other components can go here */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
