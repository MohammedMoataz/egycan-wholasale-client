import api from './axios';
import { Invoice, InvoiceResponse, ResponseData } from '../types';

export const getInvoices = async (page: number, limit: number): Promise<Invoice[]> => {
  const response = await api.get<InvoiceResponse>(`/invoices?page=${page}&limit=${limit}`);
  return response.data.data as Invoice[];
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  const response = await api.get<InvoiceResponse>(`/invoices/${id}`);
  return response.data.data as Invoice;
};

export const getMyInvoices = async (): Promise<Invoice[]> => {
  const response = await api.get<InvoiceResponse>(`/my-invoices`);
  return response.data.data as Invoice[];
};

export const createInvoice = async (cartItems: { productId: number; quantity: number }[]): Promise<Invoice> => {
  const response = await api.post<InvoiceResponse>('/invoices', { items: cartItems });
  return response.data.data as Invoice;
};

export const updateInvoiceStatus = async (id: number, status: Invoice['status']): Promise<Invoice> => {
  const response = await api.patch<InvoiceResponse>(`/invoices/${id}/status`, { status });
  return response.data.data as Invoice;
};

export const deleteInvoice = async (id: number): Promise<boolean> => {
  const response = await api.delete<InvoiceResponse>(`/invoices/${id}`);
  return response.data.success;
};

export const downloadInvoicePdf = async (id: number): Promise<void> => {
  const response = await api.get<InvoiceResponse>(`/invoices/${id}/pdf`, {
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