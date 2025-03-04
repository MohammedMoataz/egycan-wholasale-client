import api from './axios';
import { Category, Subcategory } from '../types';

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getCategory = async (id: number) => {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await api.post<Category>('/categories', { name });
  return response.data;
};

export const updateCategory = async (id: number, name: string) => {
  const response = await api.put<Category>(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/categories/${id}`);
};

export const getSubcategories = async (categoryId?: number) => {
  const url = categoryId 
    ? `/subcategories?categoryId=${categoryId}` 
    : '/subcategories';
  
  const response = await api.get<Subcategory[]>(url);
  return response.data;
};

export const getSubcategory = async (id: number) => {
  const response = await api.get<Subcategory>(`/subcategories/${id}`);
  return response.data;
};

export const createSubcategory = async (name: string, categoryId: number) => {
  const response = await api.post<Subcategory>('/subcategories', { 
    name, 
    categoryId 
  });
  return response.data;
};

export const updateSubcategory = async (id: number, name: string, categoryId: number) => {
  const response = await api.put<Subcategory>(`/subcategories/${id}`, { 
    name, 
    categoryId 
  });
  return response.data;
};

export const deleteSubcategory = async (id: number) => {
  await api.delete(`/subcategories/${id}`);
};