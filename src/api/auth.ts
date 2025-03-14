import api from './axios';
import { AuthResponse } from '../types';

export const register = async (data: FormData) => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data.data;
};

export const adminLogin = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/admin/login', {
    email,
    password,
  });
  return response.data.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post<AuthResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};