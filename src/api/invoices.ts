import api from './axios';
import { Invoice } from '../types';

export const getInvoices = async () => {
  const response = await api.get<Invoice[]>('/invoices');
  return response.data.data;
};

export const getInvoice = async (id: number) => {
  const response = await api.get<Invoice>(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (cartItems: { productId: number; quantity: number }[]) => {
  const response = await api.post<Invoice>('/invoices', { items: cartItems });
  return response.data;
};

export const updateInvoiceStatus = async (id: number, status: Invoice['status']) => {
  const response = await api.patch<Invoice>(`/invoices/${id}/status`, { status });
  return response.data;
};

export const deleteInvoice = async (id: number) => {
  await api.delete(`/invoices/${id}`);
};

export const downloadInvoicePdf = async (id: number) => {
  const response = await api.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};