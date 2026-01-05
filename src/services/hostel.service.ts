import axios from 'axios';
import { Hostel, Room } from '../types';

const API_URL = 'http://localhost:5001/api/hostels';

// ✅ Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api/hostels',
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

// ✅ Hostel services
export const getAllHostels = async () => {
  try {
    const response = await api.get('');
    return response.data.data || response.data; // supports both array or {data: []}
  } catch (error: any) {
    console.error('Error fetching hostels:', error);
    throw error.response?.data || error;
  }
};

export const getHostelById = async (id: string) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error fetching hostel by ID:', error);
    throw error.response?.data || error;
  }
};

export const createHostel = async (hostelData: FormData | any) => {
  try {
    const token = localStorage.getItem('token');
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type if not already a FormData (multipart)
    if (!(hostelData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post(
      'http://localhost:5001/api/hostels',
      hostelData,
      { headers }
    );

    console.log('✅ Hostel created:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ Error creating hostel:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const updateHostel = async (id: string, hostelData: Partial<Hostel>) => {
  try {
    const response = await api.put(`/${id}`, hostelData);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error updating hostel:', error);
    throw error.response?.data || error;
  }
};

export const deleteHostel = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error deleting hostel:', error);
    throw error.response?.data || error;
  }
};

// ✅ Room services
export const addRoom = async (hostelId: string, roomData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };

    // Don't set Content-Type for FormData - let axios handle it
    const response = await axios.post(
      `http://localhost:5001/api/hostels/${hostelId}/rooms`,
      roomData,
      { headers }
    );

    console.log('✅ Room added:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ Error adding room:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const updateRoom = async (
  hostelId: string,
  roomId: string,
  roomData: Partial<Room>
) => {
  try {
    const response = await api.put(`/${hostelId}/rooms/${roomId}`, roomData);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error updating room:', error);
    throw error.response?.data || error;
  }
};

export const deleteRoom = async (hostelId: string, roomId: string) => {
  try {
    const response = await api.delete(`/${hostelId}/rooms/${roomId}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error deleting room:', error);
    throw error.response?.data || error;
  }
};

// ✅ Upload hostel image
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error.response?.data || error;
  }
};

