import api from './axios';
import { User } from '../types';

export const getCurrentUser = async () => {
    const response = await api.get<User>(`/users/me`);
    return response.data;
};

export const updateUserProfile = async (data: {
    name?: string;
    email?: string;
}) => {
    const response = await api.patch<User>(`/users/me`, data);
    return response.data;
};

export const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    const response = await api.patch<User>(`/users/me/password`, data);
    return response.data;
};

export const deleteAccount = async (password: string) => {
    const response = await api.delete(`/users/me`, {
        data: { password }
    });
    return response.data;
};

// Admin endpoints
export const getAllUsers = async (page: number, limit: number) => {
    const response = await api.get<User[]>(`/users?page=${page}&limit=${limit}`);
    return response.data;
};

export const getUser = async (userId: number) => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
};

export const createUser = async (data: FormData) => {
    const response = await api.post<User>(`/users`, data);
    return response.data;
};

export const editUser = async (userId: number, data: unknown) => {
    const response = await api.patch<User>(`/users/${userId}`, data);
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
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};