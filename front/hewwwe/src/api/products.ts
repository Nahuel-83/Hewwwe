/**
 * Products API Service
 * 
 * Provides a collection of functions for interacting with the products endpoints of the HEWWWE backend API.
 * Handles all product-related operations including fetching, creating, updating, and deleting products.
 * Each function returns a Promise with the appropriate typed response from the API.
 * 
 * This service uses the centralized Axios instance which handles authentication tokens and error handling.
 */

import api from './axios';
import type { Product } from '../types';

// Fetch all available products (public access)
export const getAllProducts = () => api.get<Product[]>('/api/products');

// Fetch all products including non-available ones (admin only)
export const getAllProductsForAdmin = () => api.get<Product[]>('/api/products/admin/all');

// Fetch a single product by its ID
export const getProductById = (id: number) => api.get<Product>(`/api/products/${id}`);

// Create a new product
export const createProduct = (product: Partial<Product>) => api.post<Product>('/api/products', product);

// Update an existing product
export const updateProduct = (id: number, product: Partial<Product>) => api.put<Product>(`/api/products/${id}`, product);

// Delete a product
export const deleteProduct = (id: number) => api.delete(`/api/products/${id}`);

// Search for products by keyword (searches in name and description)
export const searchProducts = (query: string) => api.get<Product[]>(`/api/products/search?keyword=${encodeURIComponent(query)}`);
