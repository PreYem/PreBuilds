import { createContext, useContext, ReactNode } from "react";
import useSession from "../hooks/useSession";

interface UserData {
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_phone: string;
}

interface SessionContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const session = useSession();

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};
