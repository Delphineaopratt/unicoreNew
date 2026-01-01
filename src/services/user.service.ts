import axios from 'axios';
import { UserProfile } from '../types/index';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await API.put('/auth/updateprofile', profileData);
  return response.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await API.post('/users/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTranscript = async (file: File) => {
  const formData = new FormData();
  formData.append('transcript', file);
  const response = await API.post('/auth/upload-transcript', formData, {
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
  formData.append('jobTypes', JSON.stringify(onboardingData.jobTypes));
  formData.append('skills', JSON.stringify(onboardingData.skills));
  formData.append('interests', JSON.stringify(onboardingData.interests));
  if (onboardingData.transcript) {
    formData.append('transcript', onboardingData.transcript);
  }

  const response = await API.post('/auth/complete-onboarding', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};