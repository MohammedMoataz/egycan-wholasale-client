import api from './axios';
import { Product, ProductFilters, ProductResponse, ResponseData } from '../types';

export const getProducts = async (filters?: ProductFilters): Promise<ResponseData<Product>> => {
  const response = await api.get<ProductResponse>('/products', { params: filters });
  return response.data.data as ResponseData<Product>;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<ProductResponse>(`/products/${id}`);
  return response.data.data as Product;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<ProductResponse>('/products/search', {
    params: { query },
  });
  return response.data.data as Product[];
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await api.post<ProductResponse>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data as Product;
};

export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  const response = await api.patch<ProductResponse>(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data as Product;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const response = await api.delete<ProductResponse>(`/products/${id}`);
  return response.data.success;
};