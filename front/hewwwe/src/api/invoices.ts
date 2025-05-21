import api from './axios';
import { Invoice } from '../types';

/**
 * Fetches all invoices from the system
 * @returns Promise with array of Invoice objects
 */
export const getAllInvoices = () => api.get<Invoice[]>('/api/invoices');
/**
 * Fetches a single invoice by its ID
 * @param id Invoice ID to fetch
 * @returns Promise with Invoice object
 */
export const getInvoiceById = (id: number) => api.get<Invoice>(`/api/invoices/${id}`);
/**
 * Creates a new invoice
 * @param invoice Invoice data to create
 * @returns Promise with created Invoice object
 */
export const createInvoice = (invoice: Partial<Invoice>) => api.post<Invoice>('/api/invoices', invoice);
/**
 * Updates an existing invoice
 * @param id Invoice ID to update
 * @param invoice Invoice data to update
 * @returns Promise with updated Invoice object
 */
export const updateInvoice = (id: number, invoice: Partial<Invoice>) => api.put<Invoice>(`/api/invoices/${id}`, invoice);
/**
 * Deletes an invoice
 * @param id Invoice ID to delete
 * @returns Promise with confirmation of invoice deletion
 */
export const deleteInvoice = (id: number) => api.delete(`/api/invoices/${id}`);
/**
 * Downloads an invoice as a PDF file
 * @param id Invoice ID to download
 * @returns Promise with Blob response containing the PDF file
 */
export const downloadInvoice = (id: number) => api.get<Blob>(`/api/invoices/${id}/pdf`, {
  responseType: 'blob'
});
/**
 * Fetches all invoices for a specific user
 * @param userId User ID to fetch invoices for
 * @returns Promise with array of Invoice objects
 */
export const getUserInvoices = (userId: number) => api.get<Invoice[]>(`/api/users/${userId}/invoices`);
