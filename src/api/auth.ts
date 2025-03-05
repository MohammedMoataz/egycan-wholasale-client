import api from './axios';
import { AuthResponse } from '../types';

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  });
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

export const logout = async () => {
  await api.post('/auth/logout');
};