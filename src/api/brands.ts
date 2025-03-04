import api from './axios';
import { Brand } from '../types';

export const getBrands = async () => {
  const response = await api.get<Brand[]>('/brands');
  return response.data;
};

export const getBrand = async (id: number) => {
  const response = await api.get<Brand>(`/brands/${id}`);
  return response.data;
};

export const createBrand = async (name: string) => {
  const response = await api.post<Brand>('/brands', { name });
  return response.data;
};

export const updateBrand = async (id: number, name: string) => {
  const response = await api.put<Brand>(`/brands/${id}`, { name });
  return response.data;
};

export const deleteBrand = async (id: number) => {
  await api.delete(`/brands/${id}`);
};