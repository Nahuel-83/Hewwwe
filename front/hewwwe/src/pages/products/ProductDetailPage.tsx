/**
 * Product Detail Page Component
 * 
 * Displays detailed information about a specific product and provides functionality
 * for users to interact with the product, including adding to cart and proposing exchanges.
 * 
 * Features:
 * - Displays comprehensive product information (name, price, description, images, etc.)
 * - Shows seller information with contact options
 * - Provides product status indication with color-coded chips
 * - Allows authenticated users to add the product to their cart
 * - Enables product exchange proposals between users
 * - Handles loading states and errors gracefully
 * 
 * The exchange functionality allows users to select one of their own products to offer
 * in exchange for the displayed product, facilitating second-hand item trading.
 */

import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  Divider,
  Chip,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { getProductById } from '../../api/products';
import { getUserProducts } from '../../api/users';
import { proposeExchange } from '../../api/exchanges';
import { addToCart } from '../../api/cart';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/pages/ProductDetailPage.css';

/**
 * Product detail page component that displays comprehensive information about a product
 * and provides interaction options like adding to cart and proposing exchanges
 * @returns Product detail page component with product information and interaction options
 */
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Intercambio
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  
  const { user: currentUser, isAuthenticated } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    /**
     * Loads product data from the API based on the ID from URL parameters
     * Sets loading states and handles errors appropriately
     */
    const loadProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const res = await getProductById(Number(id));
        setProduct(res.data);
      } catch (err) {
        setError('Error al cargar los datos del producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProductData();
  }, [id]);

  /**
   * Loads the current user's available products for exchange proposals
   * Filters products to only show those that are available and not the current product
   * Opens the exchange dialog when products are loaded
   */
  const loadUserProducts = async () => {
    if (!currentUser || !isAuthenticated) {
      toast.error('Debes iniciar sesión para proponer un intercambio');
      return;
    }
    
    setExchangeLoading(true);
    
    try {
      console.log('Loading products for user ID:', currentUser.userId);
      // Llamada a la API específica para obtener productos del usuario
      const res = await getUserProducts(currentUser.userId);
      console.log('User products received:', res.data);
      
      if (!res.data || res.data.length === 0) {
        // Si no hay productos, mostrar el modal pero con el mensaje de que no hay productos
        setMyProducts([]);
        setExchangeOpen(true);
        return;
      }
      
      // Filtrar sólo productos disponibles
      const availableProducts = res.data.filter(p => 
        p.status === 'AVAILABLE' && p.productId !== Number(id)
      ) || [];
      
      console.log('Available products for exchange:', availableProducts);
      setMyProducts(availableProducts);
      setExchangeOpen(true);
    } catch (err) {
      console.error('Error loading user products:', err);
      toast.error('Error al cargar tus productos');
    } finally {
      setExchangeLoading(false);
    }
  };
  
  /**
   * Handles the click on the exchange button
   * Verifies user authentication and that the user is not the owner of the product
   * Initiates loading of user's products for exchange
   */
  const handleExchangeClick = () => {
    if (!isAuthenticated) {
      toast.info('Debes iniciar sesión para proponer un intercambio');
      return;
    }
    
    if (product?.userId === currentUser?.userId) {
      toast.info('No puedes intercambiar con tus propios productos');
      return;
    }
    
    loadUserProducts();
  };
  
  /**
   * Submits an exchange proposal to the API
   * Creates a new exchange record between the product owner and the current user
   * Handles loading states and displays appropriate success/error messages
   */
  const handleExchangeSubmit = async () => {
    if (!selectedProduct || !product || !currentUser || !product.userId) {
      toast.error('Selecciona un producto para el intercambio');
      return;
    }
    
    setExchangeLoading(true);
    
    try {
      await proposeExchange(
        product.userId,
        currentUser.userId,
        Number(product.productId),
        selectedProduct
      );
      
      toast.success('Propuesta de intercambio enviada correctamente');
      setExchangeOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error('Error al enviar la propuesta de intercambio');
      console.error(err);
    } finally {
      setExchangeLoading(false);
    }
  };
  
  /**
   * Adds the current product to the user's shopping cart
   * Verifies user authentication and that the user is not the owner of the product
   * Handles loading states and displays appropriate success/error messages
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated || !currentUser) {
      toast.info('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    
    if (!product || !product.productId) {
      toast.error('No se puede añadir este producto al carrito');
      return;
    }
    
    try {
      await addToCart(currentUser.userId, product.productId);
      toast.success('Producto añadido al carrito');
    } catch (err) {
      toast.error('Error al añadir el producto al carrito');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <Box sx={{ 
          p: 4, 
          width: '100%',
          mx: 'auto'
        }}>
          <Alert severity="error">{error || 'Producto no encontrado'}</Alert>
        </Box>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Box sx={{ 
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        p: { xs: 2, sm: 4 }
      }}>
        <Card className="product-detail-card">
          <Box className="product-detail-content">
            <Box className="product-detail-image-container">
              <CardMedia
                component="img"
                className="product-detail-image"
                image={product.image || 'placeholder.jpg'}
                alt={product.name}
              />
            </Box>

            <Box className="product-detail-info">
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', width: '100%' }}>
                {product.name}
              </Typography>

              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 'bold', width: '100%' }}>
                {product.price.toLocaleString('es-ES', { 
                  style: 'currency', 
                  currency: 'EUR'
                })}
              </Typography>

              <Divider sx={{ width: '100%' }} />

              <Typography variant="body1" color="text.secondary" sx={{ 
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                width: '100%'
              }}>
                {product.description}
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gap: 2,
                width: '100%',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
              }}>
                {/* Detalles existentes (vendedor, estado, tamaño) */}
                <Box className="detail-item">
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                    Vendedor:
                  </Typography>
                  {product.userId && (
                    <Link 
                      component={RouterLink} 
                      to={`/users/${product.userId}`}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {product.userName || 'Usuario'}
                    </Link>
                  )}
                </Box>

                <Box className="detail-item">
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                    Estado:
                  </Typography>
                  <Chip 
                    label={product.status} 
                    color={
                      product.status === 'AVAILABLE' ? 'success' :
                      product.status === 'SOLD' ? 'error' : 'warning'
                    }
                    size="small"
                  />
                </Box>

                <Box className="detail-item">
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                    Tamaño:
                  </Typography>
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.size}
                  </Typography>
                </Box>

                <Box className="detail-item" sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                    Publicado:
                  </Typography>
                  <Typography>
                    {new Date(product.publicationDate || new Date()).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>

                {/* Categoría */}
                <Box className="detail-item">
                  <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                    Categoría:
                  </Typography>
                  <Chip 
                    label={product.categoryName || 'Sin categoría'}
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={`/categories/${product.categoryId}`}
                    clickable
                    sx={{ 
                      textTransform: 'capitalize',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                </Box>
              </Box>
              
              {/* Botones de acción (comprar, intercambiar) */}
              {product.status === 'AVAILABLE' && product.userId !== currentUser?.userId && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 4,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    fullWidth
                    onClick={handleAddToCart}
                  >
                    Añadir al carrito
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<SwapHorizIcon />}
                    fullWidth
                    onClick={handleExchangeClick}
                  >
                    Proponer intercambio
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
      
      {/* Modal de intercambio */}
      <Dialog 
        open={exchangeOpen} 
        onClose={() => setExchangeOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: { xs: '95%', sm: '80%', md: '900px' }
          }
        }}
      >
        <DialogTitle>Proponer intercambio</DialogTitle>
        <DialogContent dividers>
          {exchangeLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : myProducts.length === 0 ? (
            <Alert severity="info">
              No tienes productos disponibles para intercambiar. 
              Publica un producto primero.
            </Alert>
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Selecciona uno de tus productos para intercambiar por:
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <img 
                  src={product.image || 'placeholder.jpg'}
                  alt={product.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR'
                    })}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Tus productos disponibles:
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2 
              }}>
                {myProducts.map((prod) => (
                  <Box 
                    key={prod.productId} 
                    sx={{ 
                      width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 10.7px)' }
                    }}
                  >
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedProduct === prod.productId 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 3
                        }
                      }}
                      onClick={() => setSelectedProduct(Number(prod.productId))}
                    >
                      <Box sx={{ display: 'flex', p: 2 }}>
                        <Box 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            flexShrink: 0,
                            mr: 2
                          }}
                        >
                          <img 
                            src={prod.image || 'placeholder.jpg'}
                            alt={prod.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              borderRadius: 4
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {prod.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {prod.price.toLocaleString('es-ES', { 
                              style: 'currency', 
                              currency: 'EUR'
                            })}
                          </Typography>
                          <Chip 
                            label={prod.size}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExchangeOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExchangeSubmit}
            variant="contained" 
            color="primary"
            disabled={!selectedProduct || exchangeLoading}
          >
            Proponer intercambio
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductDetailPage;
