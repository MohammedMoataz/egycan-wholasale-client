import api from './axios';
import { Business, BusinessResponse, ResponseData } from '../types';

export const getBusinesses = async (page: number, limit: number): Promise<ResponseData<Business>> => {
  const response = await api.get<BusinessResponse>(`/businesses?page=${page}&limit=${limit}`);
  return response.data.data as ResponseData<Business>;
};

export const getBusinessesByOwner = async (ownerId: number): Promise<ResponseData<Business>> => {
  const response = await api.get<BusinessResponse>(`/businesses/owner/${ownerId}`);
  return response.data.data as ResponseData<Business>;
};

export const getBusiness = async (id: number): Promise<Business> => {
  const response = await api.get<BusinessResponse>(`/businesses/${id}`);
  return response.data.data as Business;
};

export const createBusgetBusiness = async (data: FormData): Promise<Business> => {
  const response = await api.post<BusinessResponse>('/businesses', data);
  return response.data.data as Business;;
};

export const updateBusgetBusiness = async (id: number, data: FormData): Promise<Business> => {
  const response = await api.patch<BusinessResponse>(`/businesses/${id}`, data);
  return response.data.data as Business;;
};

export const approveRequest = async (businessId: number): Promise<boolean> => {
  const response = await api.patch<BusinessResponse>(`/businesses/${businessId}/approve`);
  return response.data.success;
};

export const rejectRequest = async (businessId: number): Promise<boolean> => {
  const response = await api.patch<BusinessResponse>(`/businesses/${businessId}/reject`);
  return response.data.success;
};

export const deleteBusiness = async (id: number): Promise<boolean> => {
  const response = await api.delete<BusinessResponse>(`/businesses/${id}`);
  return response.data.success;
};