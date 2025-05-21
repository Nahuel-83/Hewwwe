/**
 * Authentication API Service
 * 
 * Provides functions for user authentication operations including login and registration.
 * These functions interact with the authentication endpoints of the HEWWWE backend API.
 * 
 * Each function returns a Promise with the appropriate typed response from the API.
 * This service uses the centralized Axios instance which handles authentication tokens and error handling.
 */

import api from './axios';
import type { User } from '../types';

/**
 * Interface for login request payload
 */
export interface LoginRequest {
  /** Username or email for authentication */
  nameOrEmail: string;
  /** User password */
  password: string;
}

/**
 * Interface for login response from the API
 */
export interface LoginResponse {
  /** Whether the login was successful */
  success: boolean;
  /** User data returned after successful authentication */
  data: User;
  /** Response message from the server */
  message: string;
}

/**
 * Interface for user registration request payload
 */
export interface RegisterRequest {
  /** Unique username for the new account */
  username: string;
  /** Email address for the new account */
  email: string;
  /** Password for the new account */
  password: string;
  /** Full name of the user */
  name: string;
  /** Contact phone number */
  phone: string;
  /** User's primary address information */
  address: {
    /** Street name */
    street: string;
    /** House/building number */
    number: string;
    /** City name */
    city: string;
    /** Country name */
    country: string;
    /** Postal/ZIP code */
    postalCode: string;
  };
}

/**
 * Interface for registration response from the API
 */
interface RegisterResponse {
  /** Whether the registration was successful */
  success: boolean;
  /** Newly created user data */
  user: User;
  /** Response message from the server */
  message: string;
}

/**
 * Registers a new user in the system
 * @param userData User registration data including credentials and personal information
 * @returns Promise with registration response containing success status and user data
 */
export const register = (userData: RegisterRequest) => 
  api.post<RegisterResponse>('/api/auth/register', userData);

/**
 * Authenticates a user with the system
 * @param credentials User login credentials (username/email and password)
 * @returns Promise with login response containing success status, user data, and JWT token
 */
export const login = (credentials: LoginRequest) => 
  api.post<LoginResponse>('/api/auth/login', credentials);
