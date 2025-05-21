import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/forms.css';
import { createUser, getUserById, updateUser } from '../../../api/users';
import { toast } from 'react-toastify';
import '../../../styles/common/loading.css';
import '../../../styles/forms/form.css';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'USER',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      loadUser(Number(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      const { registrationDate, role, addresses, products, userId: _, ...rest } = response.data;
      
      // Validate role before setting state
      const validRole = role === 'ADMIN' ? 'ADMIN' : 'USER';
      
      setFormData({
        ...rest,
        role: validRole,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar el usuario');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        const { password, ...updateData } = formData; // Remove password from update data
        await updateUser(Number(id), updateData);
        toast.success('Usuario actualizado correctamente');
      } else {
        if (!formData.password) {
          toast.error('La contraseña es requerida para nuevos usuarios');
          return;
        }
        await createUser(formData);
        toast.success('Usuario creado correctamente');
      }
      navigate('/admin/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Teléfono</label>
            <input
              id="phone"
              type="text"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          {!isEdit && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                value={formData.password || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-actions">
            <button type="button" className="form-button form-button-secondary" onClick={() => navigate('/admin/users')}>Cancelar</button>
            <button type="submit" className="form-button form-button-primary" disabled={loading}>{isEdit ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
