/**
 * Shopping Cart API Service
 * 
 * Provides functions for interacting with the shopping cart endpoints of the HEWWWE backend API.
 * Handles all cart operations including viewing, adding/removing items, checkout, and admin management.
 * 
 * Each function returns a Promise with the appropriate typed response from the API.
 * This service uses the centralized Axios instance which handles authentication tokens and error handling.
 */

import api from './axios';
import { Cart, CartResponseDTO } from '../types';

/**
 * Cart API endpoints for regular users
 */

/**
 * Fetches the current shopping cart for a specific user
 * @param userId User ID to fetch cart for
 * @returns Promise with cart data including products and total price
 */
export const getUserCart = (userId: number) => api.get<CartResponseDTO>(`/api/carts/user/${userId}`);
/**
 * Adds a product to the user's shopping cart
 * @param userId User ID who owns the cart
 * @param productId Product ID to add to the cart
 * @returns Promise with updated cart data
 */
export const addToCart = (userId: number, productId: number) => api.post<CartResponseDTO>(`/api/carts/user/${userId}/products/${productId}`);
/**
 * Removes a product from the user's shopping cart
 * @param userId User ID who owns the cart
 * @param productId Product ID to remove from the cart
 * @returns Promise with updated cart data
 */
export const removeFromCart = (userId: number, productId: number) => api.delete<CartResponseDTO>(`/api/carts/user/${userId}/products/${productId}`);
/**
 * Removes all products from the user's shopping cart
 * @param userId User ID who owns the cart
 * @returns Promise with confirmation of cart clearing
 */
export const clearCart = (userId: number) => api.delete(`/api/carts/user/${userId}/clear`);

/**
 * Checkout process endpoint
 */

/**
 * Processes checkout of the user's cart and creates an invoice
 * @param userId User ID who owns the cart
 * @param checkoutData Checkout information including delivery address ID
 * @returns Promise with invoice data for the completed purchase
 */
export const checkout = (userId: number, checkoutData: { addressId: number }) => {
  return api.post(`/api/carts/user/${userId}/checkout`, checkoutData);
};

/**
 * Admin-only cart management endpoints
 */

/**
 * Fetches all shopping carts in the system (admin only)
 * @returns Promise with array of all Cart objects
 */
export const getAllCarts = () => api.get<Cart[]>('/api/carts/all');
/**
 * Deletes a shopping cart from the system (admin only)
 * @param cartId Cart ID to delete
 * @returns Promise with deletion confirmation
 */
export const deleteCart = (cartId: number) => api.delete(`/api/carts/${cartId}`);
