import axios from 'axios';
import { Notification } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getMyNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications/me`);
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await axios.put(`${API_URL}/notifications/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await axios.delete(`${API_URL}/notifications/${id}`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.put(`${API_URL}/notifications/mark-all-read`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axios.get(`${API_URL}/notifications/unread-count`);
  return response.data;
};