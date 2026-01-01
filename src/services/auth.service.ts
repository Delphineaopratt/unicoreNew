// src/services/auth.service.ts
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5001/api/auth' });

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const res = await API.post('/login', { email, password });
  // res.data: { success:true, token, user:{...} }
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return res.data;
};

export const register = async (email: string, password: string, name: string, userType: string) => {
  const res = await API.post('/register', { email, password, name, userType });
  // res.data: { success:true, token, user:{...} }
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
