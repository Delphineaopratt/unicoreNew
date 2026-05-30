import { api } from './api';
import { Notification } from '../types';

export const getMyNotifications = async () => {
  const response = await api.get('/notifications/me');
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};