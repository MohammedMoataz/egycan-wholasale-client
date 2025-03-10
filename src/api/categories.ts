import api from './axios';
import {
  Category,
  CategoryResponse,
  ResponseData,
  Subcategory,
  SubcategoryResponse
} from '../types';

export const getCategories = async (page: number, limit: number): Promise<ResponseData<Category>> => {
  const response = await api.get<CategoryResponse>(`/categories?page=${page}&limit=${limit}`);
  return response.data.data as ResponseData<Category>;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get<CategoryResponse>(`/categories/${id}`);
  return response.data.data as Category;
};

export const createCategory = async (data: FormData): Promise<Category> => {
  const response = await api.post<CategoryResponse>(`/categories`, data);
  return response.data.data as Category;
};

export const updateCategory = async (id: number, data: FormData): Promise<Category> => {
  const response = await api.patch<CategoryResponse>(`/categories/${id}`, data);
  return response.data.data as Category;;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const response = await api.delete<CategoryResponse>(`/categories/${id}`);
  return response.data.success;
};

export const getAllSubcategories = async (): Promise<ResponseData<Subcategory>> => {
  const response = await api.get<SubcategoryResponse>(`/subcategories`);
  return response.data.data as ResponseData<Subcategory>;
};

export const getSubcategories = async (categoryId: number): Promise<ResponseData<Subcategory>> => {
  const response = await api.get<SubcategoryResponse>(`/subcategories?categoryId=${categoryId}`);
  return response.data.data as ResponseData<Subcategory>;
};

export const getSubcategory = async (id: number): Promise<Subcategory> => {
  const response = await api.get<SubcategoryResponse>(`/subcategories/${id}`);
  return response.data.data as Subcategory;
};

export const createSubcategory = async (data: FormData): Promise<Subcategory> => {
  console.log(data);
  const response = await api.post<SubcategoryResponse>('/subcategories', data);
  return response.data.data as Subcategory;
};

export const updateSubcategory = async (id: number, data: FormData): Promise<Subcategory> => {
  const response = await api.patch<SubcategoryResponse>(`/subcategories/${id}`, data);
  return response.data.data as Subcategory;
};

export const deleteSubcategory = async (id: number): Promise<boolean> => {
  const response = await api.delete<SubcategoryResponse>(`/subcategories/${id}`);
  return response.data.success;
};