/**
 * Products Page Component
 * 
 * Main marketplace page that displays all available products for purchase.
 * Provides a grid layout of product cards with images, details, and cart functionality.
 * 
 * Features:
 * - Displays all available products in a responsive grid layout
 * - Filters out products that are not available or belong to the current user
 * - Allows users to add/remove products to/from their shopping cart
 * - Shows product status with color-coded chips
 * - Provides navigation to detailed product view on card click
 * - Handles loading states and empty results gracefully
 * 
 * The page is accessible to all users, but cart functionality is only available
 * to authenticated users. Unauthenticated users will be prompted to log in.
 */

import { useState, useEffect } from 'react';
import { Typography, Button, Chip } from '@mui/material';
import { ShoppingCart as CartIcon, RemoveShoppingCart as RemoveCartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../api/products';
import { addToCart, removeFromCart, getUserCart } from '../../api/cart';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, CartResponseDTO } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/ProductsPage.css';

/**
 * Products page component that displays all available products for purchase
 * @returns Products page component with product grid and cart functionality
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [userCart, setUserCart] = useState<CartResponseDTO | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadProducts();
    
    // Load user's cart if authenticated
    if (isAuthenticated && user) {
      loadUserCart();
    }
  }, [isAuthenticated, user]);

  /**
   * Loads all products from the API
   * Filters out products that are not available or belong to the current user
   */
  const loadProducts = async () => {
    try {
      setIsProductsLoading(true);
      const response = await getAllProducts();
      console.log('All products loaded:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setIsProductsLoading(false);
    }
  };
  
  /**
   * Loads the current user's shopping cart
   * Only called when user is authenticated
   */
  const loadUserCart = async () => {
    if (!user) return;
    
    try {
      setCartLoading(true);
      const response = await getUserCart(user.userId);
      setUserCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setCartLoading(false);
    }
  };
  
  /**
   * Checks if a product is already in the user's cart
   * @param productId ID of the product to check
   * @returns True if the product is in the cart, false otherwise
   */
  const isProductInCart = (productId: number | undefined): boolean => {
    if (!userCart || !productId) return false;
    return userCart.productIds && Array.isArray(userCart.productIds) 
      ? userCart.productIds.includes(productId)
      : false;
  };
  
  /**
   * Handles adding or removing a product from the cart
   * @param event Mouse event to prevent propagation
   * @param product Product to add or remove from cart
   */
  const handleToggleCart = async (event: React.MouseEvent, product: Product) => {
    event.stopPropagation(); // Prevent card click navigation
    
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    
    if (!product.productId) {
      console.error('Error: productId is undefined', product);
      toast.error('Error al identificar el producto');
      return;
    }
    
    try {
      setCartLoading(true);
      
      if (isProductInCart(product.productId)) {
        // Remove from cart
        await removeFromCart(user.userId, product.productId);
        toast.success('Producto eliminado del carrito');
      } else {
        // Add to cart
        await addToCart(user.userId, product.productId);
        toast.success('Producto añadido al carrito');
      }
      
      // Reload cart to update UI
      await loadUserCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error al actualizar el carrito');
    } finally {
      setCartLoading(false);
    }
  };

  // Filter products that are only AVAILABLE and not the user's own products
  const availableProducts = products.filter(product => {
    // Log each product status for debugging
    console.log(`Product ${product.productId} (${product.name}) - Status: ${product.status}`);
    
    // Filter out sold products
    if (product.status !== 'AVAILABLE') {
      console.log(`Product ${product.productId} filtered out - Status: ${product.status}`);
      return false;
    }
    
    // If authenticated, filter out user's own products
    if (isAuthenticated && user && product.userId === user.userId) {
      console.log(`Product ${product.productId} filtered out - User's own product`);
      return false;
    }
    
    return true;
  });

  return (
    <div className="products-container">
      <div className="products-content">
        {isProductsLoading ? (
          <Typography>Loading products...</Typography>
        ) : (
          <div className="products-grid">
            {availableProducts.length === 0 ? (
              <Typography variant="h6" className="no-products-message">
                No hay productos disponibles en este momento
              </Typography>
            ) : (
              availableProducts.map((product) => (
                <div
                  key={product.productId}
                  className="product-card"
                  onClick={() => navigate(`/products/${product.productId}`)}
                >
                  <div className="product-card-content">
                    <div
                      className="product-image-container"
                      style={{ backgroundImage: `url(${product.image})` }}
                    >
                    </div>
                    <div className="product-content">
                      <h2>{product.name}</h2>
                      <p className="product-price">{product.price}€</p>
                      <p className="product-description">{product.description}</p>
                    </div>
                  </div>
                  <div className="product-actions">
                    <Chip
                      label={product.status}
                      color={
                        product.status === 'AVAILABLE' ? 'success' :
                        product.status === 'RESERVED' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                    
                    {isAuthenticated && (
                      <Button
                        size="small"
                        variant="outlined"
                        color={isProductInCart(product.productId) ? 'error' : 'primary'}
                        startIcon={isProductInCart(product.productId) ? <RemoveCartIcon /> : <CartIcon />}
                        onClick={(e) => handleToggleCart(e, product)}
                        disabled={cartLoading}
                      >
                        {isProductInCart(product.productId) ? 'Quitar' : 'Añadir'}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}