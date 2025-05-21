import { useState, useEffect } from 'react';
import { Typography, Button, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserProducts } from '../../api/users';
import { deleteProduct } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import type { Product } from '../../types';
import '../../styles/pages/MyProductsPage.css';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProducts(user!.userId);
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };
  
  const handleCardClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="my-products-container">
      <div className="my-products-content">
        <div className="my-products-header">
          <Typography variant="h4" className="my-products-title">
            Mis Productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/products/new')}
            className="add-product-button"
          >
            Nuevo Producto
          </Button>
        </div>

        {isLoading ? (
          <Typography>Cargando productos...</Typography>
        ) : (
          <div className="my-products-grid">
            {products.length === 0 ? (
              <Typography variant="h6" sx={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                No tienes productos aún. ¡Crea uno nuevo!
              </Typography>
            ) : (
              products.map((product) => (
                <div 
                  key={product.productId}
                  className="my-product-card"
                >
                  <div 
                    className="my-product-card-content"
                    onClick={() => product.productId && handleCardClick(product.productId)}
                  >
                    <div className="my-product-image-container">
                      <img
                        className="my-product-image"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="my-product-content">
                      <Typography variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="my-product-description">
                        {product.description}
                      </Typography>
                      <Typography className="my-product-price">
                        {product.price}€
                      </Typography>
                      <div className="my-product-status">
                        <Chip
                          label={product.status}
                          color={
                            product.status === 'AVAILABLE' ? 'success' :
                            product.status === 'RESERVED' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="my-product-actions">
                    <Button
                      variant="outlined"
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.productId) {
                          navigate(`/products/${product.productId}/edit`);
                        }
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.productId !== undefined) {
                          handleDelete(product.productId);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
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
