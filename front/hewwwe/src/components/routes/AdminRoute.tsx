import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
