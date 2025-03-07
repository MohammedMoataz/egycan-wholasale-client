import api from './axios';
import { Product, ProductFilters } from '../types';

export const getProducts = async (filters: ProductFilters) => {
  const response = await api.get<Product[]>('/products', { params: filters });
  return response.data.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await api.get<Product[]>('/products/search', {
    params: { query },
  });
  return response.data.data;
};

export const createProduct = async (formData: FormData) => {
  const response = await api.post<Product>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, formData: FormData) => {
  const response = await api.put<Product>(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};