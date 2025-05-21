/**
 * Admin Route Component
 * 
 * Protected route component that restricts access to admin-only routes.
 * Ensures that only authenticated users with admin role can access the wrapped routes.
 * 
 * Behavior:
 * - Redirects to login page if user is not authenticated
 * - Redirects to home page if user is authenticated but not an admin
 * - Renders children components if user is authenticated and has admin role
 * 
 * Used to protect all administrative sections of the application including
 * user management, product management, and other admin-only features.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props for the AdminRoute component
 */
interface AdminRouteProps {
  /** Child components to render when access is granted */
  children: React.ReactNode;
}

/**
 * Route wrapper that enforces admin-only access control
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 