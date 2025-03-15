import api from './axios';
import { ResponseData, User, UserResponse } from '../types';

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<UserResponse>(`/users/me`);
    return response.data.data as User;
};

export const updateUserProfile = async (data: FormData): Promise<User> => {
    const response = await api.patch<UserResponse>(`/users/me`, data);
    return response.data.data as User;
};

export const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}): Promise<User> => {
    const response = await api.patch<UserResponse>(`/users/me/password`, data);
    return response.data.data as User;
};

export const deleteAccount = async (password: string): Promise<boolean> => {
    const response = await api.delete<UserResponse>(`/users/me`, {
        data: { password }
    });
    return response.data.success;
};

// Admin endpoints
export const getAllUsers = async (page?: number, limit?: number): Promise<ResponseData<User>> => {
    const response = await api.get<UserResponse>(`/users?page=${page}&limit=${limit}`);
    return response.data.data as ResponseData<User>;
};

export const getTotalCustomers = async (): Promise<ResponseData<User>> => {
    const response = await api.get<UserResponse>(`/users?role=customer`);
    return response.data.data as ResponseData<User>;
};

export const getUser = async (userId: number): Promise<User> => {
    const response = await api.get<UserResponse>(`/users/${userId}`);
    return response.data.data as User;
};

export const createUser = async (formData: FormData): Promise<User> => {
    const response = await api.post<UserResponse>(`/users`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.data as User;
};

export const updateUser = async (userId: number, formData: FormData): Promise<User> => {
    const response = await api.patch<UserResponse>(`/users/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data as User;
};

export const deleteUser = async (userId: number): Promise<boolean> => {
    const response = await api.delete<UserResponse>(`/users/${userId}`);
    return response.data.success;
};