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

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.altKey && e.key === "d") {
        e.preventDefault();
        setIsDarkMode((prevMode) => !prevMode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center w-15 h-8">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} className="sr-only peer" />
        <div className={`w-14 h-6 ${isDarkMode ? 'bg-black' : 'bg-white'} rounded-full flex items-center px-1`}
        >
          {/* Slider Knob */}
          <div
            className={`absolute top w-5 h-5 rounded-full bg-gray-100 shadow-md transform transition-transform duration-300 ${
              isDarkMode ? "translate-x-[1.875rem]" : "translate-x-[-0.1rem]"
            }`}
          ></div>
          {/* Sun Icon */}
          <div
            className={`absolute left-1 w-4 h-4 text-yellow-400 flex items-center justify-center transition-opacity duration-300 ${
              isDarkMode ? "opacity-0" : "opacity-100"
            }`}
          >
            <i className="bx bx-sun"></i>
          </div>
          {/* Moon Icon */}
          <div
            className={`absolute right-1 w-4 h-4 text-blue-400 flex items-center justify-center transition-opacity duration-300 ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
          >
            <i className="bx bxs-moon"></i>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
