import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { createProduct, getProductById, updateProduct } from '../../api/products';
import { getAllCategories } from '../../api/categories';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Category, Product } from '../../types';
import '../../styles/pages/ProductFormPage.css';
import { uploadImage } from '../../contexts/UploadCloud';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams(); // Get product ID from URL params
  const isEditMode = !!id; // Check if we're in edit mode
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    image: '',
    images: [] as string[],
    categoryId: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: ''
  });

  useEffect(() => {
    loadCategories();
    
    // If in edit mode, load the product data
    if (isEditMode && id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      const product = response.data;
      
      // Set form data with existing product values
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        size: product.size || '',
        image: product.image || '',
        images: product.image ? [product.image] : [],
        categoryId: product.categoryId.toString()
      });
    } catch (error) {
      toast.error('Error al cargar el producto');
      console.error('Error loading product:', error);
      navigate('/my-products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);
        const imageUrl = await uploadImage(file);
        
        setFormData({
          ...formData,
          image: imageUrl,
          images: [...formData.images, imageUrl]
        });
        
        toast.success('Imagen subida correctamente');
      } catch (error: any) {
        console.error('Error al subir la imagen:', error);
        const errorMessage = error.message || 'Error al subir la imagen. Por favor, inténtalo de nuevo.';
        toast.error(errorMessage);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    setFormData({
      ...formData,
      images: newImages,
      image: newImages.length > 0 ? newImages[0] : ''
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      valid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
      valid = false;
    }
    
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
      valid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número positivo';
      valid = false;
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es obligatoria';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar que el usuario esté autenticado
      if (!user || !user.userId) {
        toast.error('Debes iniciar sesión para crear un producto');
        return;
      }
      
      // Create a product object that matches the backend's ProductCreateDTO structure exactly
      const productData: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        size: formData.size,
        image: formData.image || 'https://via.placeholder.com/150',
        status: 'AVAILABLE' as const,
        categoryId: Number(formData.categoryId)
      };
      
      if (isEditMode && id) {
        // Update existing product
        await updateProduct(parseInt(id), productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        // Create new product with additional fields for creation
        const newProductData: Partial<Product> & { 
          publicationDate: string; 
          userId: number;
        } = {
          ...productData,
          publicationDate: new Date().toISOString(),
          userId: user.userId
        };
        
        await createProduct(newProductData);
        toast.success('Producto creado exitosamente');
      }
      
      navigate('/my-products');
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
      
      // Mostrar mensaje de error más específico si está disponible
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el producto. Por favor, inténtalo de nuevo.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-content">
        <div className="product-form-header">
          <Typography variant="h4" className="product-form-title">
            {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
        </div>
        
        <div className="product-form-paper">
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre del producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Descripción"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Precio (€)"
              name="price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="size"
              label="Talla/Tamaño"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
            
            <Box className="image-upload-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
              <Box className="image-upload-item">
                <input
                  type="file"
                  accept="image/*"
                  name="fileInput"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label className="file-input-label" htmlFor="fileInput">
                  <span className="upload-button">
                    <AddPhotoAlternateIcon />
                  </span>
                  {uploadingImage && (
                    <div className="upload-loading">
                      <CircularProgress size={24} />
                    </div>
                  )}
                </label>
              </Box>
              
              {formData.images.map((image, index) => (
                <Box key={index} className="image-preview-wrapper">
                  <div className="image-preview-item">
                    <img src={image} alt={`Producto ${index + 1}`} />
                    <IconButton
                      size="small"
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </Box>
              ))}
            </Box>
            
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.categoryId}
            >
              <InputLabel id="category-label">Categoría</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                label="Categoría"
                onChange={handleSelectChange}
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem value="">
                    <CircularProgress size={20} /> Cargando...
                  </MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
            </FormControl>
            
            <div className="form-actions">
              <Button
                variant="outlined"
                onClick={() => navigate('/my-products')}
                disabled={loading}
                className="form-cancel-button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="form-submit-button"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
