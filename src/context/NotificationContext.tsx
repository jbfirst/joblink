import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification } from '../types';
import {
  getNotifications,
  createNotification,
  markNotificationAsRead
} from '../lib/appwrite';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function fromRow(row: any): AppNotification {
  return {
    id: row.$id,
    title: row.title,
    message: row.message,
    timestamp: row.timestamp || row.$createdAt,
    read: !!row.read,
    type: row.type,
    link: row.link || undefined
  };
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Charge les notifications réelles de l'utilisateur connecté
  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const rows = await getNotifications(user.id);
      setNotifications(rows.map(fromRow));
    } catch (error) {
      console.error('Erreur chargement notifications :', error);
    }
  };

  useEffect(() => {
    loadNotifications();

    if (!user) return;

    // Rafraîchissement léger périodique, pour que le badge de
    // notifications non lues (Navbar) se mette à jour sans avoir
    // besoin d'ouvrir la page Notifications ou de se reconnecter.
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markNotificationAsRead(id).catch((error) => {
      console.error('Erreur marquage notification lue :', error);
    });
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    unreadIds.forEach((id) => {
      markNotificationAsRead(id).catch((error) => {
        console.error('Erreur marquage notification lue :', error);
      });
    });
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;

    // Affichage optimiste immédiat avec un ID temporaire
    const tempId = `temp-${Date.now()}`;
    const optimisticNotif: AppNotification = {
      ...notif,
      id: tempId,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [optimisticNotif, ...prev]);

    createNotification(user.id, { ...notif, read: false })
      .then((created) => {
        // On remplace l'ID temporaire par le vrai ID Appwrite
        setNotifications((prev) =>
          prev.map((n) => (n.id === tempId ? { ...n, id: created.$id } : n))
        );
      })
      .catch((error) => {
        console.error('Erreur création notification :', error);
      });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        refreshNotifications: loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
