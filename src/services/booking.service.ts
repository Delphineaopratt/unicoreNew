import axios from 'axios';
import { Booking } from '../types';

const API_URL = 'http://localhost:5000/api/bookings';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBooking = async (bookingData: Partial<Booking>) => {
  const response = await api.post('', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/my-bookings');
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const response = await api.put(`/${id}/status`, { status });
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.put(`/${id}/cancel`);
  return response.data;
};

// For hostel admins
export const getHostelBookings = async (hostelId: string) => {
  const response = await api.get(`/hostel/${hostelId}`);
  return response.data;
};