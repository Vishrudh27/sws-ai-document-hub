import api from "./api";

export const fetchNotifications = () => api.get("/notifications").then((response) => response.data);
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put(`/notifications/read-all`);
