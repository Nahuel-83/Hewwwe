import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';
import { theme } from './theme';

// Pages Public
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages Protected
import MyProductsPage from './pages/products/MyProductsPage';
import UserDetailPage from './pages/users/UserDetailPage';
import CartPage from './pages/cart/CartPage';
import MyAddressesPage from './pages/addresses/MyAddressesPage';
import ProductsFormPage from './pages/products/ProductFormPage';
import ExchangesPage from './pages/exchanges/ExchangesPage';

// Pages Admin
import AdminCategoriesPage from './pages/admin/category/AdminCategoriesPage';
import AdminInvoicesPage from './pages/admin/invoice/AdminInvoicesPage';
import AdminProductsPage from './pages/admin/product/AdminProductsPage';
import AdminUsersPage from './pages/admin/user/AdminUsersPage';
import AdminExchangesPage from './pages/admin/exchange/AdminExchangesPage';
import AdminAddressPage from './pages/admin/address/AdminAddressesPage';
import AdminCategoryForm from './pages/admin/category/AdminCategoryForm';
import AdminProductForm from './pages/admin/product/AdminProductForm';
import AdminUserForm from './pages/admin/user/AdminUserForm';
import AdminAddressForm from './pages/admin/address/AdminAddressForm';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

/**
 * Main application component
 * Sets up routing and main providers
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    // Authentication provider to manage global authentication state
    <AuthProvider>
      {/* Theme provider for Material-UI configuration */}
      <ThemeProvider theme={theme}>
        {/* Router configuration */}
        <BrowserRouter>
          <Routes>
            {/* Main layout wrapping all routes */}
            <Route path="/" element={<MainLayout />}>
              {/* Public routes accessible to all users */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />

              {/* Protected routes requiring authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="my-products" element={<MyProductsPage />} />
                <Route path="products/new" element={<ProductsFormPage />} />
                <Route path="products/:id/edit" element={<ProductsFormPage />} />
                <Route path="my-addresses" element={<MyAddressesPage />} />
                <Route path="users/:id/cart" element={<CartPage />} />
                <Route path="exchanges" element={<ExchangesPage />} />
              </Route>
              
              {/* Admin routes requiring admin role */}
              <Route element={<AdminRoute />}>
                {/* Category management */}
                <Route path="admin/categories" element={<AdminCategoriesPage />} />
                <Route path="admin/categories/new" element={<AdminCategoryForm />} />
                <Route path="admin/categories/:id/edit" element={<AdminCategoryForm />} />

                {/* User management */}
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/users/:id/edit" element={<AdminUserForm />} />

                {/* Invoice management */}
                <Route path="admin/invoices" element={<AdminInvoicesPage />} />

                {/* Product management */}
                <Route path="admin/products" element={<AdminProductsPage />} />
                <Route path="admin/products/:id/edit" element={<AdminProductForm />} />

                {/* Exchange management */}
                <Route path="admin/exchanges" element={<AdminExchangesPage />} />

                {/* Address management */}
                <Route path='admin/addresses' element={<AdminAddressPage />} />
                <Route path='admin/addresses/:id/edit' element={<AdminAddressForm />} />
              </Route>
            </Route>
          </Routes>
          {/* Toast notifications container */}
          <ToastContainer position="bottom-right" />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
