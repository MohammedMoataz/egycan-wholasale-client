import api from './axios';
import { Brand, BrandResponse, ResponseData } from '../types';

export const getBrands = async (page: number, limit: number): Promise<ResponseData<Brand>[]> => {
  const response = await api.get<BrandResponse[]>(`/brands?page=${page}&limit=${limit}`);
  return response.data.data as ResponseData<Brand>[];
};

export const getBrand = async (id: number): Promise<Brand> => {
  const response = await api.get<BrandResponse>(`/brands/${id}`);
  return response.data.data as Brand;
};

export const createBrand = async (data: FormData): Promise<Brand> => {
  const response = await api.post<BrandResponse>('/brands', data);
  return response.data.data as Brand;
};

export const updateBrand = async (id: number, data: FormData): Promise<Brand> => {
  const response = await api.patch<BrandResponse>(`/brands/${id}`, data);
  return response.data.data as Brand;
};

export const deleteBrand = async (id: number): Promise<boolean> => {
  const response = await api.delete<BrandResponse>(`/brands/${id}`);
  return response.data.success;
};