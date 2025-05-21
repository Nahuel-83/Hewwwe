/**
 * Theme Toggle Component
 * 
 * Button component that allows users to switch between light and dark themes.
 * Positioned in the top-right corner of the application for easy access.
 * 
 * Features:
 * - Visual indication of current theme mode
 * - Tooltip explaining the action
 * - Smooth transition between themes
 * - Accessibility support with proper labeling
 * 
 * Uses the ThemeContext to access and modify the application's theme state.
 */

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Button that toggles between light and dark theme modes
 */
export const ThemeToggle = () => {
  const { mode, toggleColorMode } = useTheme();

  return (
    <Tooltip title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}>
      <IconButton 
        onClick={toggleColorMode} 
        color="inherit"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};
