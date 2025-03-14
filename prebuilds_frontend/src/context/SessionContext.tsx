import { createContext, useContext, ReactNode } from "react";
import useSession from "../hooks/useSession";

// Define the UserData type
interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
}

// Define the SessionContextType
interface SessionContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
}

// Create the SessionContext with an initial value of undefined
const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

// SessionProvider component
export const SessionProvider = ({ children }: SessionProviderProps) => {
  const session = useSession();
  
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};