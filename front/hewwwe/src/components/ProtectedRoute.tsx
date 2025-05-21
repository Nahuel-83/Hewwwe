/**
 * Protected Route Component
 * 
 * Route wrapper that restricts access to authenticated users only.
 * Redirects unauthenticated users to the login page when they attempt to access protected content.
 * 
 * This component is used to protect routes that require authentication, such as:
 * - User profile pages
 * - Shopping cart and checkout
 * - Product management for sellers
 * - User-specific data like addresses and orders
 * 
 * Works in conjunction with the AuthContext to determine authentication state.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** Child components to render when access is granted */
  children: React.ReactNode;
}

/**
 * Route wrapper that enforces authentication requirements
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 