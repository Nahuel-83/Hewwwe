import Navigation from '../components/Navigation';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * Main Layout Component
 * 
 * The main layout component that provides a consistent structure for the application.
 * It includes a navigation bar and a main content area.
 * 
 * The layout is used as a wrapper for all pages, ensuring a consistent look and feel.
 * It provides a clean and organized way to display content while maintaining a
 * consistent navigation experience across the application.
 */
export default function MainLayout() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f2e8cf'
    }}>
      <Navigation />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
