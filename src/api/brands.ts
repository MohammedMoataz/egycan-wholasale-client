import api from './axios';
import { Brand } from '../types';

export const getBrands = async (page: number, limit: number) => {
  const response = await api.get<Brand[]>(`/brands?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getBrand = async (id: number) => {
  const response = await api.get<Brand>(`/brands/${id}`);
  return response.data;
};

export const createBrand = async (data: string) => {
  const response = await api.post<Brand>('/brands', data);
  return response.data;
};

export const updateBrand = async (id: number, name: string) => {
  const response = await api.put<Brand>(`/brands/${id}`, { name });
  return response.data;
};

export const deleteBrand = async (id: number) => {
  const response = await api.delete(`/brands/${id}`);
  return response.data;
};