/**
 * Users API Service
 * 
 * Provides a collection of functions for interacting with the user-related endpoints of the HEWWWE backend API.
 * Handles all user operations including fetching, creating, updating, and deleting users,
 * as well as managing user-related resources like addresses and products.
 * 
 * Each function returns a Promise with the appropriate typed response from the API.
 * This service uses the centralized Axios instance which handles authentication tokens and error handling.
 */

import api from './axios';
import { User, Product, Address } from '../types';

/**
 * Fetches all users from the system (admin only)
 * @returns Promise with array of User objects
 */
export const getAllUsers = () => api.get<User[]>('/api/users');
/**
 * Fetches a single user by their ID
 * @param id User ID to fetch
 * @returns Promise with User object
 */
export const getUserById = (id: number) => api.get<User>(`/api/users/${id}`);
/**
 * Creates a new user in the system
 * @param user User data to create
 * @returns Promise with created User object
 */
export const createUser = (user: Partial<User>) => api.post<User>('/api/users', user);
/**
 * Updates an existing user's information
 * @param id User ID to update
 * @param user Updated user data
 * @returns Promise with updated User object
 */
export const updateUser = (id: number, user: Partial<User>) => api.put<User>(`/api/users/${id}`, user);
/**
 * Deletes a user from the system
 * @param id User ID to delete
 * @returns Promise with deletion confirmation
 */
export const deleteUser = (id: number) => api.delete(`/api/users/${id}`);

/**
 * Fetches all products owned by a specific user
 * @param userId User ID to fetch products for
 * @returns Promise with array of Product objects
 */
export const getUserProducts = (userId: number) => api.get<Product[]>(`/api/users/${userId}/products`);

/**
 * Fetches all addresses associated with a specific user
 * @param userId User ID to fetch addresses for
 * @returns Promise with array of Address objects
 */
export const getUserAddresses = (userId: number) => api.get<Address[]>(`/api/users/${userId}/addresses`);
/**
 * Creates a new address for a specific user
 * @param userId User ID to create address for
 * @param address Address data to create
 * @returns Promise with created Address object
 */
export const createAddress = (userId: number, address: Partial<Address>) => 
  api.post<Address>(`/api/users/${userId}/addresses`, address);
/**
 * Links an existing address to a user
 * @param userId User ID to link address to
 * @param addressId Address ID to link
 * @returns Promise with confirmation of link
 */
export const linkAddressToUser = (userId: number, addressId: number) => 
  api.post<void>(`/api/users/${userId}/addresses/${addressId}/link`);
/**
 * Unlinks an address from a user
 * @param userId User ID to unlink address from
 * @param addressId Address ID to unlink
 * @returns Promise with confirmation of unlink
 */
export const unlinkAddressFromUser = (userId: number, addressId: number) => 
  api.delete(`/api/users/${userId}/addresses/${addressId}`);
