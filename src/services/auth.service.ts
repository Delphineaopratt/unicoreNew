// src/services/auth.service.ts
import { api } from './api';

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return res.data;
};

export const register = async (email: string, password: string, name: string, userType: string) => {
  const res = await api.post('/auth/register', { email, password, name, userType });
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
