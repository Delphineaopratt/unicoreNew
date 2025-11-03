import axios from 'axios';
import { Job, JobApplication } from '../types';

const API_URL = 'http://localhost:5000/api';

// Job-related services
export const getAllJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: Partial<Job>) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

// Job application services
export const applyForJob = async (jobId: string, applicationData: Partial<JobApplication>) => {
  const response = await axios.post(`${API_URL}/jobs/${jobId}/apply`, applicationData);
  return response.data;
};

export const getJobApplications = async (jobId: string) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}/applications`);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await axios.get(`${API_URL}/applications/me`);
  return response.data;
};

export const getApplicationById = async (id: string) => {
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

export const updateApplicationStatus = async (id: string, status: JobApplication['status']) => {
  const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
  return response.data;
};