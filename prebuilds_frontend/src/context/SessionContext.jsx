import { createContext, useContext } from "react";
import useSession from "../hooks/useSession";
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const session = useSession(); // Fetch session data

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};
