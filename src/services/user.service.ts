import axios from 'axios';
import { User, UserProfile } from '../types';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with token interceptor
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

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await api.put('/users/me/profile', profileData);
  return response.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/users/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTranscript = async (file: File) => {
  const formData = new FormData();
  formData.append('transcript', file);
  const response = await api.post('/users/me/transcript', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const completeOnboarding = async (onboardingData: {
  program: string;
  cgpa: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript: File | null;
}) => {
  const formData = new FormData();
  formData.append('program', onboardingData.program);
  formData.append('cgpa', onboardingData.cgpa);
  formData.append('skills', JSON.stringify(onboardingData.skills));
  formData.append('interests', JSON.stringify(onboardingData.interests));
  if (onboardingData.transcript) {
    formData.append('transcript', onboardingData.transcript);
  }

  const response = await api.post('/auth/complete-onboarding', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getEmployers = async () => {
  const response = await api.get('/users/employers');
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get('/users/students');
  return response.data;
};

export const getHostelAdmins = async () => {
  const response = await api.get('/users/hostel-admins');
  return response.data;
};