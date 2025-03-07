import api from './axios';
import { BusinessInfo } from '../types';

export const getBusinesses = async (page: number, limit: number) => {
  const response = await api.get<BusinessInfo[]>(`/businesses?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getBusiness = async (id: number) => {
  const response = await api.get<BusinessInfo>(`/businesses/${id}`);
  return response.data;
};

export const createBusgetBusiness = async (data: FormData) => {
  const response = await api.post<BusinessInfo>('/businesses', data);
  return response.data;
};

export const updateBusgetBusiness = async (id: number, data: FormData) => {
  const response = await api.put<BusinessInfo>(`/businesses/${id}`, data);
  return response.data;
};

export const deleteBusgetBusiness = async (id: number) => {
  const response = await api.delete(`/businesses/${id}`);
  return response.data;
};