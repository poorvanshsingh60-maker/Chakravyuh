import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO';
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: 'SUCCESS' | 'ERROR' | 'INFO') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: 'SUCCESS' | 'ERROR' | 'INFO' = 'SUCCESS') => {
    const id = String(Date.now());
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification }}>
      {children}
      {/* Toast Render */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded-lg text-xs font-semibold shadow-lg border animate-in slide-in-from-bottom ${
              n.type === 'SUCCESS' ? 'bg-[#ecfdf3] text-[#0b7c3e] border-[#abefc6]' : 'bg-[#fef3f2] text-[#d92d20] border-[#fecdca]'
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
