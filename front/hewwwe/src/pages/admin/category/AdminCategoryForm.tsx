import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/forms.css';
import { createCategory, getCategoryById, updateCategory } from '../../../api/categories';
import type { Category } from '../../../types';
import { toast } from 'react-toastify';

export default function AdminCategoryForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      loadCategory(Number(id));
    }
  }, [id]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await getCategoryById(categoryId);
      const { products, categoryId: _, ...rest } = response.data;
      setCategory(rest);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar la categoría');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name || !category.description) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateCategory(Number(id), category);
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(category);
        toast.success('Categoría creada correctamente');
      }
      navigate('/admin/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && isEdit) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={category.name}
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
              value={category.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="form-button form-button-secondary" onClick={() => navigate('/admin/categories')}>Cancelar</button>
            <button type="submit" className="form-button form-button-primary" disabled={loading}>{isEdit ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
