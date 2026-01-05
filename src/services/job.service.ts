import axios from 'axios';
import { Job, JobApplication } from '../types';

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
  
  // Don't set Content-Type for FormData requests
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Job-related services
export const getAllJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: Partial<Job>) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await api.get('/jobs/my-jobs');
  return response.data;
};

// Job application services
export const applyForJob = async (jobId: string, applicationData: FormData | Partial<JobApplication>) => {
  const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
  return response.data;
};

export const getJobApplications = async (jobId: string) => {
  const response = await api.get(`/jobs/${jobId}/applications`);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/jobs/applications/me');
  return response.data;
};

export const getApplicationById = async (id: string) => {
  const response = await api.get(`/jobs/applications/${id}`);
  return response.data;
};

export const updateApplicationStatus = async (id: string, status: string) => {
  const response = await api.put(`/jobs/applications/${id}/status`, { status });
  return response.data;
};

export const getEmployerApplications = async () => {
  const response = await api.get('/jobs/applications/employer');
  return response.data;
};

// Notification services
export const getNotifications = async () => {
  const response = await api.get('/jobs/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await api.put(`/jobs/notifications/${id}/read`);
  return response.data;
};

export const createNotification = async (notificationData: {
  title: string;
  message: string;
  type: string;
  relatedApplication?: string;
  relatedJob?: string;
}) => {
  const response = await api.post('/jobs/notifications', notificationData);
  return response.data;
};