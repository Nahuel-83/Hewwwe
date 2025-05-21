import api from './axios';
import type { Exchange } from '../types';

/**
 * Fetches all exchanges from the system
 * @returns Promise with array of Exchange objects
 */
export const getAllExchanges = () => api.get<Exchange[]>('/api/exchanges');
/**
 * Fetches a single exchange by its ID
 * @param exchangeId Exchange ID to fetch
 * @returns Promise with Exchange object
 */
export const getExchangeById = (exchangeId: number) => api.get<Exchange>(`/api/exchanges/${exchangeId}`);
/**
 * Creates a new exchange
 * @param exchange Exchange data to create
 * @returns Promise with created Exchange object
 */
export const createExchange = (exchange: Partial<Exchange>) => 
  api.post<Exchange>('/api/exchanges', exchange);
/**
 * Updates an existing exchange
 * @param id Exchange ID to update
 * @param status New status for the exchange
 * @returns Promise with updated Exchange object
 */
export const updateExchangeStatus = (id: number, status: string) => 
  api.put<Exchange>(`/api/exchanges/${id}/status`, { status });
/**
 * Deletes an exchange
 * @param id Exchange ID to delete
 * @returns Promise with confirmation of exchange deletion
 */
export const deleteExchange = (id: number) => api.delete(`/api/exchanges/${id}`);
/**
 * Fetches all exchanges for a specific user
 * @param userId User ID to fetch exchanges for
 * @returns Promise with array of Exchange objects
 */
export const getUserExchanges = (userId: number) => api.get<Exchange[]>(`/api/exchanges/user/${userId}`);

/**
 * Proposes a new exchange
 * @param ownerId ID of the owner of the product being exchanged
 * @param requesterId ID of the user requesting the exchange
 * @param ownerProductId ID of the product the owner is offering
 * @param requesterProductId ID of the product the requester is offering
 * @returns Promise with created Exchange object
 */
export const proposeExchange = (
  ownerId: number,    // Usuario dueño del producto deseado
  requesterId: number, // Usuario que solicita el intercambio
  ownerProductId: number, // Producto que el solicitante desea obtener
  requesterProductId: number // Producto que el solicitante ofrece a cambio
) => api.post<Exchange>('/api/exchanges', {
  ownerId,
  requesterId,
  ownerProductId,
  requesterProductId
});

/**
 * Accepts an exchange
 * @param exchangeId ID of the exchange to accept
 * @returns Promise with updated Exchange object
 */
export const acceptExchange = (exchangeId: number) => 
  api.put<Exchange>(`/api/exchanges/${exchangeId}/accept`);

/**
 * Rejects an exchange
 * @param exchangeId ID of the exchange to reject
 * @returns Promise with updated Exchange object
 */
export const rejectExchange = (exchangeId: number) => 
  api.put<Exchange>(`/api/exchanges/${exchangeId}/reject`);

/**
 * Cancels an exchange
 * @param exchangeId ID of the exchange to cancel
 * @returns Promise with confirmation of exchange cancellation
 */
export const cancelExchange = (exchangeId: number) => 
  api.delete(`/api/exchanges/${exchangeId}`);
