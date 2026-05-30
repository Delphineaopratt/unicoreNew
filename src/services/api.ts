// src/services/api.ts
import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // If sending FormData, let the browser set Content-Type (with boundary)
  if (config && config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers) delete config.headers['Content-Type'];
  }

  return config;
});
