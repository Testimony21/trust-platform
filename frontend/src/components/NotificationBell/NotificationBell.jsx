import { useEffect, useRef, useState } from "react";
import { Bell, Star } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";
import socket from "../../api/socket";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      setToast(notification);
      setTimeout(() => setToast(null), 5000);
    };

    socket.on("newNotification", handleNewNotification);
    return () => socket.off("newNotification", handleNewNotification);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleMarkRead = async (notification) => {
    if (notification.read) return;
    try {
      await markNotificationAsRead(notification._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button className="notif-bell-btn" onClick={handleToggle} aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 && (
              <p className="notif-empty">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n._id}
                className={`notif-item ${n.read ? "" : "unread"}`}
                onClick={() => handleMarkRead(n)}
              >
                {n.type === "review" && <Star size={16} className="notif-icon" />}
                <div>
                  <p>{n.message}</p>
                  <span>{timeAgo(n.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="notif-toast">
          <Star size={16} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}