import api from './axios';
import { Address } from '../types';

/**
 * Fetches all addresses from the system
 * @returns Promise with array of Address objects
 */
export const getAllAddresses = () => api.get<Address[]>('/api/addresses');
/**
 * Fetches a single address by its ID
 * @param id Address ID to fetch
 * @returns Promise with Address object
 */
export const getAddressById = (id: number) => api.get<Address>(`/api/addresses/${id}`);
/**
 * Creates a new address (user only)
 * @param address Address data to create
 * @returns Promise with created Address object
 */
export const createAddress = (address: Partial<Address>) => {
  const userId = address.userId;
  return api.post<Address>(`/api/addresses/user/${userId}`, address);
};
/**
 * Updates an existing address (user only)
 * @param id Address ID to update
 * @param address Address data to update
 * @returns Promise with updated Address object
 */
export const updateAddress = (id: number, address: Partial<Address>) => api.put<Address>(`/api/addresses/${id}`, address);
/**
 * Deletes an address (user only)
 * @param id Address ID to delete
 * @returns Promise with confirmation of address deletion
 */
export const deleteAddress = (id: number) => api.delete(`/api/addresses/${id}`);
