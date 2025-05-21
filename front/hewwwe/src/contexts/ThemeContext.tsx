/**
 * Theme Context
 * 
 * Provides global theme state management for the HEWWWE application.
 * Handles switching between light and dark theme modes throughout the application.
 * 
 * Features:
 * - Centralized theme state accessible from any component
 * - Toggle function to switch between light and dark modes
 * - Memoized context value to prevent unnecessary re-renders
 * - Custom hook for easy access to theme state and functions
 * 
 * Used by components like ThemeToggle and applied to the Material UI ThemeProvider.
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

/**
 * Type definition for the theme context value
 */
type ThemeContextType = {
  /** Current theme mode ('light' or 'dark') */
  mode: 'light' | 'dark';
  /** Function to toggle between light and dark modes */
  toggleColorMode: () => void;
};

/** 
 * Context that holds the theme state and toggle function 
 * Initialized with an empty object cast to ThemeContextType
 */
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

/**
 * Provider component that makes theme state available to all child components
 * @param children Child components that will have access to the theme context
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  /**
   * Toggles between light and dark theme modes
   */
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to access the theme context
 * @returns The theme context value containing mode and toggleColorMode function
 */
export const useTheme = () => useContext(ThemeContext);
