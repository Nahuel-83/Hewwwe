/**
 * Navigation Component
 * 
 * Main navigation bar for the HEWWWE application that adapts based on user authentication state.
 * Provides different navigation options for authenticated users, admin users, and guests.
 * Features include:
 * - Main site navigation links
 * - Admin-specific menu when user has admin role
 * - User dropdown menu with profile and account options
 * - Shopping cart access
 * - Login/Register buttons for unauthenticated users
 * - Active route highlighting
 */

import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import '../styles/Navigation.css';

export default function Navigation() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

  // Helper function to determine if a route is currently active
  const isActive = (path: string) => location.pathname === path;

  // Renders the admin navigation menu when user has admin role
  const renderAdminMenu = () => {
    if (!isAdmin) return null;

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button className="nav-link" component={RouterLink} to="/admin/products">
          Productos
        </Button>
        <Button className="nav-link" component={RouterLink} to="/admin/categories">
          Categorías
        </Button>
        <Button className="nav-link" component={RouterLink} to="/admin/users">
          Usuarios
        </Button>
        <Button className="nav-link" component={RouterLink} to="/admin/exchanges">
          Intercambios
        </Button>
        <Button className="nav-link" component={RouterLink} to="/admin/invoices">
          Facturas
        </Button>
        <Button className="nav-link" component={RouterLink} to="/admin/addresses">
          Direcciones
        </Button>
      </Box>
    );
  };

  // Renders the user dropdown menu with profile and account options
  const renderUserMenu = () => {
    if (!user) return null;

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={RouterLink} to={`/users/${user.userId}`}>
          Mi Perfil
        </MenuItem>
        <MenuItem component={RouterLink} to="/my-products">
          Mis Productos
        </MenuItem>
        <MenuItem component={RouterLink} to="/my-addresses">
          Mis Direcciones
        </MenuItem>
        <MenuItem component={RouterLink} to="/exchanges">
          Intercambios
        </MenuItem>
        <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
      </Menu>
    );
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar className="nav-container">
        <div className="nav-menu">
          <Button
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            component={RouterLink}
            to="/"
          >
            Inicio
          </Button>

          {isAuthenticated && !isAdmin && (
            <Button
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              component={RouterLink}
              to="/products"
            >
              Productos
            </Button>
          )}

          {renderAdminMenu()}
        </div>

        <div className="nav-user-section">
          {isAuthenticated ? (
            <>
              <IconButton
                className="nav-icon-button"
                component={RouterLink}
                to={`/users/${user?.userId}/cart`}
                size="large"
              >
                <ShoppingCart />
              </IconButton>
              <IconButton
                className="nav-icon-button"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="large"
              >
                <AccountCircle />
              </IconButton>
              {renderUserMenu()}
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
