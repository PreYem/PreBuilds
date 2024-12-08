import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
          className="sr-only peer"
        />
        <div className="w-14 h-8 bg-black rounded-full flex items-center px-1">
          {/* Slider Knob */}
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              isDarkMode ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
          {/* Sun Icon */}
          <div
            className={`absolute left-1 w-6 h-6 text-yellow-400 flex items-center justify-center transition-opacity duration-300 ${
              isDarkMode ? "opacity-0" : "opacity-100"
            }`}
          >
            🌞
          </div>
          {/* Moon Icon */}
          <div
            className={`absolute right-1 w-6 h-6 text-blue-400 flex items-center justify-center transition-opacity duration-300 ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
          >
            🌙
          </div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
