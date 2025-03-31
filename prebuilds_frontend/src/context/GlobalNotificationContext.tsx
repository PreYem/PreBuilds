import React, { createContext, useState, ReactNode, useContext } from 'react';

type NotificationType = "successMessage" | "databaseError" | "warningMessage";

interface NotificationContextType {
  message: string;
  type: NotificationType;
  showNotification: (message: string, type: NotificationType) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<NotificationType>('successMessage');

  const showNotification = (message: string, type: NotificationType) => {
    setMessage(message);
    setType(type);
  };

  const clearNotification = () => {
    setMessage('');
    setType('successMessage');
  };

  return (
    <NotificationContext.Provider value={{ message, type, showNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
