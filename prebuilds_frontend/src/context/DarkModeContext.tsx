import { createContext, useEffect, useState, ReactNode } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface DarkModeProviderProps {
  children: ReactNode; 
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {

    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>{children}</DarkModeContext.Provider>;
};

export default DarkModeContext;
