
import { api } from './api';
import { Hostel, Room } from '../types';

// ✅ Hostel services
export const getAllHostels = async () => {
  try {
    const response = await api.get('/hostels');
    return response.data.data || response.data; // supports both array or {data: []}
  } catch (error: any) {
    console.error('Error fetching hostels:', error);
    throw error.response?.data || error;
  }
};

export const getMyHostels = async () => {
  try {
    const response = await api.get('/hostels/admin/my-hostels');
    return response.data.data || response.data || [];
  } catch (error: any) {
    console.error('Error fetching admin hostels:', error);
    throw error.response?.data || error;
  }
};

export const getHostelById = async (id: string) => {
  try {
    const response = await api.get(`/hostels/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error fetching hostel by ID:', error);
    throw error.response?.data || error;
  }
};



export const createHostel = async (formData: FormData) => {
  try {
    const response = await api.post('/hostels', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating hostel:", error.response?.data || error);
    throw error;
  }
};


export const updateHostel = async (id: string, hostelData: Partial<Hostel>) => {
  try {
    const response = await api.put(`/hostels/${id}`, hostelData);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error updating hostel:', error);
    throw error.response?.data || error;
  }
};

export const deleteHostel = async (id: string) => {
  try {
    const response = await api.delete(`/hostels/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error deleting hostel:', error);
    throw error.response?.data || error;
  }
};

// ✅ Room services
export const addRoom = async (hostelId: string, roomData: FormData) => {
  try {
    const response = await api.post(`/hostels/${hostelId}/rooms`, roomData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error adding room:', error);
    throw error.response?.data || error;
  }
};

export const updateRoom = async (
  hostelId: string,
  roomId: string,
  roomData: Partial<Room>
) => {
  try {
    const response = await api.put(`/hostels/${hostelId}/rooms/${roomId}`, roomData);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error updating room:', error);
    throw error.response?.data || error;
  }
};

export const deleteRoom = async (hostelId: string, roomId: string) => {
  try {
    const response = await api.delete(`/hostels/${hostelId}/rooms/${roomId}`);
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
    const response = await api.post('/hostels/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error.response?.data || error;
  }
};