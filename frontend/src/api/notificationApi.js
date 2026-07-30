import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getNotifications = async (page = 1, limit = 20) => {
  const res = await axios.get(
    `${API_URL}/api/notifications?page=${page}&limit=${limit}`,
    authHeader()
  );
  return res.data; // { notifications, unreadCount }
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await axios.patch(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {},
    authHeader()
  );
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axios.patch(
    `${API_URL}/api/notifications/read-all`,
    {},
    authHeader()
  );
  return res.data;
};