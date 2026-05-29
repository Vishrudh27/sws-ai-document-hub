import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";
import { createNotificationSocket } from "../services/socketService";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const refreshNotifications = useCallback(async () => {
    try {
      const items = await fetchNotifications();
      setNotifications(items);
      setUnreadCount(items.filter((item) => !item.readStatus).length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleIncomingNotification = useCallback((notification) => {
    setNotifications((current) => [notification, ...current]);
    setUnreadCount((count) => count + (notification.readStatus ? 0 : 1));

    if (notification.type === "SUCCESS") {
      toast.success(notification.message || "Upload completed");
      window.dispatchEvent(new Event("documentsUpdated"));
    } else if (notification.type === "ERROR") {
      toast.error(notification.message || "Upload failed");
    } else {
      toast(notification.message || "New notification received");
    }
  }, []);

  useEffect(() => {
    refreshNotifications();

    const socket = createNotificationSocket(
      handleIncomingNotification,
      undefined,
      () => setConnectionError(true),
      () => setConnectionError(true)
    );

    return () => {
      socket.close();
    };
  }, [handleIncomingNotification, refreshNotifications]);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, readStatus: true } : item
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, readStatus: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    connectionError,
    markRead,
    markAllRead,
    refreshNotifications,
  };
}
