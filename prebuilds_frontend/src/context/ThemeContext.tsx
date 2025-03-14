import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ThemeContext = createContext<any>(undefined);

export const useTheme = () => useContext(ThemeContext);


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
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

  return <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>{children}</ThemeContext.Provider>;
};
