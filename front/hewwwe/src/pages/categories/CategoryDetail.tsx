import '../../styles/pages/categories/CategoryDetail.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCategoryById, deleteCategory } from '../../api/categories';
import { Category } from '../../types';
import ProductCard from '../../components/ProductCard';
import { toast } from 'react-toastify';

const CategoryDetail = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadCategory(Number(id));
  }, [id]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await getCategoryById(categoryId);
      setCategory(response.data);
    } catch (error) {
      toast.error('Error al cargar la categoría');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(Number(id));
      toast.success('Categoría eliminada correctamente');
      navigate('/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!category) return null;

  return (
    <Box className="category-detail-container">
      <Box className="category-header">
        <Typography 
          variant="h4" 
          className="category-title"
        >
          {category.name}
        </Typography>
        <Box className="category-actions">
          <Button 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmDelete(true)}
          >
            Eliminar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/categories/${category.categoryId}/edit`)}
          >
            Editar
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/categories')}
          >
            Volver
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Box className="grid-container">
        {/* Información de la Categoría */}
        <Card className="card-hover">
          <Paper className="card-content">
            <Typography variant="h6" gutterBottom className="section-title">
              Información de la Categoría
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Nombre" 
                  secondary={category.name}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Descripción" 
                  secondary={category.description}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Número de Productos" 
                  secondary={
                    <Box component="div" sx={{ mt: 1 }}>
                      <Chip 
                        label={category.products?.length || 0}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  }
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Card>

        {/* Lista de Productos */}
        <Card className="card-hover">
          <Paper className="card-content">
            <Typography variant="h6" gutterBottom className="section-title">
              Productos en esta Categoría
            </Typography>
            <Box className="products-grid" sx={{ 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
            }}>
              {category.products?.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </Box>
          </Paper>
        </Card>
      </Box>
    </Box>
  );
};

export default CategoryDetail;
