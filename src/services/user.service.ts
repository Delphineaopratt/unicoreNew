import axios from 'axios';
import { User, UserProfile } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/users/me`);
  return response.data;
};

export const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await axios.put(`${API_URL}/users/me/profile`, profileData);
  return response.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${API_URL}/users/me/profile-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTranscript = async (file: File) => {
  const formData = new FormData();
  formData.append('transcript', file);
  const response = await axios.post(`${API_URL}/users/me/transcript`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getEmployers = async () => {
  const response = await axios.get(`${API_URL}/users/employers`);
  return response.data;
};

export const getStudents = async () => {
  const response = await axios.get(`${API_URL}/users/students`);
  return response.data;
};

export const getHostelAdmins = async () => {
  const response = await axios.get(`${API_URL}/users/hostel-admins`);
  return response.data;
};