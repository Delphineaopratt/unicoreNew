// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if it exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth services
// export const login = async (email: string, password: string) => {
//   const response = await api.post('/auth/login', { email, password });
//   if (response.data.token) {
//     // Remove 'Bearer ' prefix if it exists before storing
//     const token = response.data.token.replace('Bearer ', '');
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(response.data.user));
//   }
//   return response.data;
// };

// export const register = async (userData: any) => {
//   const response = await api.post('/auth/register', userData);
//   if (response.data.token) {
//     // Remove 'Bearer ' prefix if it exists before storing
//     const token = response.data.token.replace('Bearer ', '');
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(response.data.user));
//   }
//   return response.data;
// };

// export const logout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };

// export const getCurrentUser = () => {
//   const userStr = localStorage.getItem('user');
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const isAuthenticated = () => {
//   return !!localStorage.getItem('token');
// };


// src/services/auth.service.ts
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api/auth' });

export const login = async (email: string, password: string) => {
  const res = await API.post('/login', { email, password });
  // res.data: { success:true, data:{ user:{...}, token } }
  const { token, user } = res.data.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return res.data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
