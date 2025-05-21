/**
 * Authentication Context
 * 
 * Provides global authentication state management for the HEWWWE application.
 * Handles user authentication, role-based access control, and persistent login state.
 * Features include:
 * - User login/logout functionality
 * - Persistent authentication using localStorage
 * - Role-based access control (admin vs regular users)
 * - User profile data management
 * - Context hook for easy access throughout the application
 */

import { createContext, useContext, useState } from 'react';
import { User } from '../types';

// Interface defining the authentication context shape and available methods
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateAuthUser: (userData: User) => void;
}

// Create the context with undefined as default value (will be populated by provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication state and methods to all children.
 * Initializes user state from localStorage for persistent authentication.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user state from localStorage for persistent login
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Derived authentication states
  const isAuthenticated = Boolean(user);  // Whether a user is logged in
  const isAdmin = user?.role === 'ADMIN';  // Whether the user has admin privileges

  // Handles user login by storing user data in state and localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handles user logout by clearing user data from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Updates the authenticated user's data (e.g., after profile changes)
  const updateAuthUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing the authentication context
 * Ensures the hook is used within an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
