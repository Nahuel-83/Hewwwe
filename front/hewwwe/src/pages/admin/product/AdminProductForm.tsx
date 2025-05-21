import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/forms.css';
import { createProduct, getProductById, updateProduct } from '../../../api/products';
import { getAllCategories } from '../../../api/categories';
import type { Product, Category } from '../../../types';
import { toast } from 'react-toastify';
import { uploadImage } from '../../../contexts/UploadCloud';
import { CircularProgress } from '@mui/material';

export default function ProductForm() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    size: '',
    status: 'AVAILABLE',
    categoryId: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const loadProduct = async (productId: number) => {
    try {
      const response = await getProductById(productId);
      const loadedProduct = response.data;
      setProduct(loadedProduct);
      
      // Inicializar la matriz de imágenes si hay una imagen
      if (loadedProduct.image) {
        setImages([loadedProduct.image]);
      }
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/admin/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(parseInt(id), product);
        toast.success('Producto actualizado');
      } else {
        await createProduct(product);
        toast.success('Producto creado');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setProduct(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file);
      
      // Actualizar el producto y la lista de imágenes
      setProduct(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      setImages([imageUrl]);
      
      toast.success('Imagen subida correctamente');
    } catch (error: any) {
      toast.error('Error al subir la imagen: ' + (error.message || 'Error desconocido'));
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploadingImage(false);
      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setProduct(prev => ({
      ...prev,
      image: ''
    }));
    setImages([]);
  };

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows={4}
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="price" className="form-label">Precio</label>
              <input
                id="price"
                type="number"
                name="price"
                className="form-input"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="categoryId" className="form-label">Categoría</label>
              <select
                id="categoryId"
                name="categoryId"
                className="form-input"
                value={product.categoryId || ''}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Imagen</label>
            <div style={{ marginBottom: '10px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="form-button form-button-secondary" style={{ display: 'inline-block', cursor: 'pointer', marginRight: '10px' }}>
                {uploadingImage ? 'Subiendo...' : 'Seleccionar imagen'}
                {uploadingImage && (
                  <CircularProgress size={16} style={{ marginLeft: '8px', color: 'white' }} />
                )}
              </label>
              
              {product.image && (
                <button 
                  type="button" 
                  className="form-button form-button-danger"
                  onClick={handleRemoveImage}
                >
                  Eliminar imagen
                </button>
              )}
            </div>
            
            {product.image && (
              <div style={{ 
                marginTop: '10px', 
                border: '1px solid #ddd', 
                padding: '10px', 
                borderRadius: '4px',
                position: 'relative'
              }}>
                <img 
                  src={product.image} 
                  alt="Vista previa del producto" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    display: 'block',
                    margin: '0 auto'
                  }} 
                />
              </div>
            )}
          </div>
          
          <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="size" className="form-label">Talla</label>
              <input
                id="size"
                type="text"
                name="size"
                className="form-input"
                value={product.size}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="status" className="form-label">Estado</label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={product.status}
                onChange={handleChange}
                required
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="SOLD">Vendido</option>
                <option value="RESERVED">Reservado</option>
              </select>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="form-button form-button-primary">{id ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="form-button form-button-secondary" onClick={() => navigate('/admin/products')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
