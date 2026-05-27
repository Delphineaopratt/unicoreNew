import { api } from './api';

// The endpoints for job preferences are under /job-preferences

// Save job preferences
export const saveJobPreferences = async (preferences: {
  program: string;
  cgpa: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript?: string;
}) => {
  try {
    const response = await api.post('/job-preferences', preferences);
    return response.data;
  } catch (error: any) {
    console.error('Error saving job preferences:', error);
    throw error;
  }
};

// Get job preferences
export const getJobPreferences = async () => {
  try {
    const response = await api.get('/job-preferences');
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No preferences found
    }
    console.error('Error fetching job preferences:', error);
    throw error;
  }
};

// Delete job preferences
export const deleteJobPreferences = async () => {
  try {
    const response = await api.delete('/job-preferences');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting job preferences:', error);
    throw error;
  }
};

// Get recommended jobs based on preferences
export const getRecommendedJobs = async () => {
  try {
    const response = await api.get('/job-preferences/recommended-jobs');
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return []; // No preferences or no matching jobs
    }
    console.error('Error fetching recommended jobs:', error);
    throw error;
  }
};
