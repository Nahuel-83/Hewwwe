/**
 * Product Card Component
 * 
 * Reusable card component that displays product information in a visually appealing format.
 * Used throughout the application to present products in grids and lists.
 * 
 * Features:
 * - Responsive design with consistent styling
 * - Interactive card that navigates to product details on click
 * - Visual status indicator (available, sold, reserved) with color coding
 * - Truncated description with ellipsis for longer text
 * - Formatted price display with currency symbol
 * - Fallback image handling for missing product images
 * 
 * The component follows the HEWWWE design system with custom styling defined in ProductCard.css.
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import '../styles/components/ProductCard.css';
import { Product } from '../types';

/**
 * Props for the ProductCard component
 */
interface ProductCardProps {
  /** Product data to display in the card */
  product: Product;
}

/**
 * Renders a card displaying product information with image, name, description, price and status
 */
const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="product-card"
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <CardMedia
        component="img"
        className="product-card-media"
        image={product.image || 'https://via.placeholder.com/200'}
        alt={product.name}
      />
      <CardContent className="product-card-content">
        <Typography gutterBottom variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography 
          color="text.secondary" 
          className="product-description"
        >
          {product.description}
        </Typography>
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" color="primary">
            {product.price.toLocaleString('es-ES', { 
              style: 'currency', 
              currency: 'EUR'
            })}
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;
