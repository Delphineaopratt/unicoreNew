import { api } from './api';
import { UserProfile } from '../types/index';

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await api.put('/auth/updateprofile', profileData);
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
  const response = await api.post('/auth/upload-transcript', formData, {
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

  const response = await api.post('/auth/complete-onboarding', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};