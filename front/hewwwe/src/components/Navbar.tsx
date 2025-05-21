/**
 * Main navigation bar component
 * Handles navigation and displays different options based on user role
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

/**
 * Shopping cart icon component
 * @returns SVG element of the cart icon
 */
const CartIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

/**
 * User icon component
 * @returns SVG element of the user icon
 */
const UserIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

/**
 * Mobile menu icon component
 * @returns SVG element of the menu icon
 */
const MenuIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

/**
 * Interface for dropdown menu styles
 */
interface DropdownStyle {
  display: 'block';
  padding: string;
  color: string;
  fontFamily: string;
  fontSize: string;
  textDecoration: 'none';
  transition: string;
}

/**
 * Interface for dropdown button styles
 */
interface DropdownButtonStyle extends DropdownStyle {
  width: '100%';
  textAlign: 'left';
  border: 'none';
  backgroundColor: 'transparent';
  cursor: 'pointer';
}

/**
 * Interface for mobile button styles
 */
interface MobileButtonStyle {
  width: '100%';
  textAlign: 'left';
  background: 'none';
  border: 'none';
  cursor: 'pointer';
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  color: string;
  padding: string;
}

/**
 * Main navigation bar component
 * @returns Navigation bar element with menus and options based on user role
 */
export default function Navbar(): React.ReactElement {
  // Get authentication state and functions
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  // States to control menu visibility
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const location = useLocation();

  /**
   * Checks if a route is active
   * @param path Route to check
   * @returns true if the current route matches the provided path
   */
  const isActive = (path: string): boolean => location.pathname === path;

  /**
   * Toggles the visibility of the mobile menu
   */
  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
    setShowUserDropdown(false);
  };

  /**
   * Toggles the visibility of the user dropdown menu
   */
  const toggleUserDropdown = (): void => {
    setShowUserDropdown(!showUserDropdown);
    setShowMobileMenu(false);
  };

  // Styles for dropdown menu items
  const dropdownItemStyle: DropdownStyle = {
    display: 'block',
    padding: '0.5rem 1rem',
    color: '#4a4e4a',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '0.9375rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease'
  };

  // Styles for dropdown menu buttons
  const dropdownButtonStyle: DropdownButtonStyle = {
    ...dropdownItemStyle,
    width: '100%',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  };

  // Styles for mobile menu buttons
  const mobileButtonStyle: MobileButtonStyle = {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    color: '#606158',
    padding: '0.75rem'
  };

  return (
    <nav className="navbar">
      {/* Logo and link to home */}
      <Link to="/" className="navbar-brand">Hewwwe</Link>
      
      {/* Mobile menu toggle button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <MenuIcon />
      </button>
      
      {/* Main navigation menu */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
        </li>
        
        {/* Links for non-admin users */}
        {!isAdmin && (
          <li className="nav-item">
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Products
            </Link>
          </li>
        )}
        
        {/* Links for admin users */}
        {isAdmin && (
          <>
            <li className="nav-item">
              <Link to="/admin/products" className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/categories" className={`nav-link ${isActive('/admin/categories') ? 'active' : ''}`}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/exchanges" className={`nav-link ${isActive('/admin/exchanges') ? 'active' : ''}`}>
                Exchanges
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/invoices" className={`nav-link ${isActive('/admin/invoices') ? 'active' : ''}`}>
                Invoices
              </Link>
            </li>
          </>
        )}
      </ul>
      
      {/* User actions (cart and user menu) */}
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            {/* Link to cart */}
            <Link 
              to={`/users/${user?.userId}/cart`}
              className="navbar-action"
              aria-label="Cart"
            >
              <CartIcon />
            </Link>
            
            {/* User dropdown menu */}
            <div style={{ position: 'relative' }}>
              <button 
                className="navbar-action" 
                onClick={toggleUserDropdown}
                aria-label="User menu"
              >
                <UserIcon />
              </button>
              
              {showUserDropdown && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                  minWidth: '160px',
                  zIndex: 1000,
                  padding: '0.5rem 0'
                }}>
                  {/* User menu options */}
                  <Link 
                    to={`/users/${user?.userId}`}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/my-products"
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    My Products
                  </Link>
                  <Link 
                    to="/my-addresses"
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    My Addresses
                  </Link>
                  <button 
                    onClick={logout}
                    className="dropdown-item"
                    style={dropdownButtonStyle}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Login and register buttons for unauthenticated users
          <>
            <Link to="/login" className="btn btn-text">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="mobile-menu active">
          <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
            Home
          </Link>
          
          {!isAdmin && (
            <Link to="/products" className="nav-link" onClick={toggleMobileMenu}>
              Products
            </Link>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin/products" className="nav-link" onClick={toggleMobileMenu}>
                Products
              </Link>
              <Link to="/admin/categories" className="nav-link" onClick={toggleMobileMenu}>
                Categories
              </Link>
              <Link to="/admin/users" className="nav-link" onClick={toggleMobileMenu}>
                Users
              </Link>
              <Link to="/admin/exchanges" className="nav-link" onClick={toggleMobileMenu}>
                Exchanges
              </Link>
              <Link to="/admin/invoices" className="nav-link" onClick={toggleMobileMenu}>
                Invoices
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <Link to={`/users/${user?.userId}`} className="nav-link" onClick={toggleMobileMenu}>
                My Profile
              </Link>
              <Link to="/my-products" className="nav-link" onClick={toggleMobileMenu}>
                My Products
              </Link>
              <Link to="/my-addresses" className="nav-link" onClick={toggleMobileMenu}>
                My Addresses
              </Link>
              <Link to={`/users/${user?.userId}/cart`} className="nav-link" onClick={toggleMobileMenu}>
                My Cart
              </Link>
              <button 
                className="nav-link"
                style={mobileButtonStyle}
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={toggleMobileMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
} 