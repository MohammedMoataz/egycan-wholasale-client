import api from './axios';
import { AuthResponse, PersonalInfo, SignUpResponse, User, UserResponse } from '../types';

export const signUp = async (data: PersonalInfo): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>('/auth/signUp', data);
  return response.data;
};

export const updateUser = async (data: FormData): Promise<User> => {
  const response = await api.patch<UserResponse>(`/auth/new-password`, data);
  return response.data.data as User;
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