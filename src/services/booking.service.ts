import { api } from './api';
import { Booking } from '../types';

export const createBooking = async (bookingData: Partial<Booking>) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

// For hostel admins
export const getHostelBookings = async (hostelId: string) => {
  const response = await api.get(`/bookings/hostel/${hostelId}`);
  return response.data;
};