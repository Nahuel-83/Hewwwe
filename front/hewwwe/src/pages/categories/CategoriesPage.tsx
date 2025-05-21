import '../../styles/pages/categories/CategoriesPage.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllCategories } from '../../api/categories';
import { deleteCategory } from '../../api/categories';
import { Category } from '../../types';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      toast.success('Categoría eliminada correctamente');
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar la categoría');
    } finally {
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="categories-container">
      <Box className="categories-header">
        <Typography variant="h4" className="categories-title">
          Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categories/new')}
        >
          Nueva Categoría
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <Card key={category.categoryId} className="category-card">
            <CardContent>
              <ListItem className="category-item">
                <ListItemText
                  primary={
                    <Typography variant="h6" className="category-name">
                      {category.name}
                    </Typography>
                  }
                  secondary={category.description}
                />
                <Box className="category-actions">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/categories/${category.categoryId}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryToDelete(category.categoryId);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>

      {/* Confirmation Dialog */}
      <Dialog open={Boolean(categoryToDelete)} onClose={() => setCategoryToDelete(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryToDelete(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
