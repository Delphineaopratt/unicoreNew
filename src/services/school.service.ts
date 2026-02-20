import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get current student's school information
export const getSchoolInfo = async () => {
  const response = await api.get('/school');
  return response.data;
};

// Update or create school information
export const updateSchoolInfo = async (schoolData: {
  name: string;
  address?: string;
  email?: string;
  website?: string;
  phone?: string;
  registrationNumber?: string;
  accreditation?: string;
}) => {
  const response = await api.post('/school', schoolData);
  return response.data;
};

// Delete school information
export const deleteSchoolInfo = async () => {
  const response = await api.delete('/school');
  return response.data;
};

// Get user profile with school information
export const getUserProfileWithSchool = async (userId: string) => {
  const response = await api.get(`/school/profile/${userId}`);
  return response.data;
};

export default api;
