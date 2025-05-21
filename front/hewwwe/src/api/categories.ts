/**
 * Categories API Service
 * 
 * Provides functions for interacting with the category-related endpoints of the HEWWWE backend API.
 * Handles all category operations including fetching, creating, updating, and deleting categories,
 * as well as retrieving products within specific categories.
 * 
 * Each function returns a Promise with the appropriate typed response from the API.
 * This service uses the centralized Axios instance which handles authentication tokens and error handling.
 */

import api from './axios';
import { Category, Product } from '../types';

/**
 * Fetches all product categories from the system
 * @returns Promise with array of Category objects
 */
export const getAllCategories = () => api.get<Category[]>('/api/categories');
/**
 * Fetches a single category by its ID
 * @param id Category ID to fetch
 * @returns Promise with Category object
 */
export const getCategoryById = (id: number) => api.get<Category>(`/api/categories/${id}`);
/**
 * Creates a new product category (admin only)
 * @param category Category data to create
 * @returns Promise with created Category object
 */
export const createCategory = (category: Partial<Category>) => api.post<Category>('/api/categories', category);
/**
 * Updates an existing category (admin only)
 * @param id Category ID to update
 * @param category Updated category data
 * @returns Promise with updated Category object
 */
export const updateCategory = (id: number, category: Partial<Category>) => api.put<Category>(`/api/categories/${id}`, category);
/**
 * Deletes a category from the system (admin only)
 * @param id Category ID to delete
 * @returns Promise with deletion confirmation
 */
export const deleteCategory = (id: number) => api.delete(`/api/categories/${id}`);
/**
 * Fetches all products belonging to a specific category
 * @param id Category ID to fetch products for
 * @returns Promise with array of Product objects
 */
export const getCategoryProducts = (id: number) => api.get<Product[]>(`/api/categories/${id}/products`);
