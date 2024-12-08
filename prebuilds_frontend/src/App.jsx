import React from "react";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import DarkModeToggle from "./components/DarkModeToggle"; // Import DarkModeToggle component
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Dark mode toggle button */}
        <header className="p-4">
          <DarkModeToggle />
        </header>

        <TopNavbar />
        <AdminNavBar />
      </div>
    </ThemeProvider>
  );
};

export default App;
