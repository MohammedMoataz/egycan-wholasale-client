import api from './axios';
import { User } from '../types';

export const getCurrentUser = async () => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
}) => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch<User>('/users/me/password', data);
  return response.data;
};

export const deleteAccount = async (password: string) => {
  await api.delete('/users/me', {
    data: { password }
  });
};

// Admin endpoints
export const getAllUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const approveUser = async (userId: number) => {
  const response = await api.patch<User>(`/users/${userId}/approve`);
  return response.data;
};

export const rejectUser = async (userId: number) => {
  const response = await api.patch<User>(`/users/${userId}/reject`);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  await api.delete(`/users/${userId}`);
};