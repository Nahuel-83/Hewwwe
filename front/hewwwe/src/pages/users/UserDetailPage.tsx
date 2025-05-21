import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  CircularProgress,
  TextField,
  Avatar,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById, deleteUser, updateUser } from '../../api/users';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import '../../styles/pages/UserDetailPage.css';

export default function UserDetailPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logout, updateAuthUser } = useAuth();

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserById(Number(id));
      setUser(response.data);
      // Initialize the edited user with current data
      setEditedUser({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone
      });
    } catch (error) {
      toast.error('Error al cargar los datos del usuario');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !window.confirm('¿Estás seguro de eliminar tu cuenta?')) return;

    try {
      await deleteUser(user.userId);
      toast.success('Cuenta eliminada correctamente');
      if (authUser?.userId === user.userId) {
        logout();
      }
      navigate('/');
    } catch (error) {
      toast.error('Error al eliminar la cuenta');
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      // Reset edited values to current user data
      setEditedUser({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
    setEditing(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user || !editedUser) return;

    // Validate form
    if (!editedUser.name || !editedUser.email) {
      setError('Nombre y email son campos obligatorios');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) {
      setError('El formato del email no es válido');
      return;
    }

    try {
      setLoading(true);
      const response = await updateUser(user.userId, editedUser);
      setUser(response.data);
      
      // If this is the current logged in user, update auth context
      if (authUser?.userId === user.userId) {
        updateAuthUser(response.data);
      }
      
      toast.success('Perfil actualizado correctamente');
      setEditing(false);
      setError(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Error al actualizar el perfil');
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-detail-container">
        <div className="user-detail-content">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="user-detail-container">
      <div className="user-detail-content">
        <div className="user-detail-header">
          <Typography variant="h4" className="user-detail-title">
            Perfil de Usuario
          </Typography>
          {authUser?.userId === user.userId && !editing && (
            <div className="user-actions">
              <Button 
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                className="edit-profile-button"
              >
                Editar
              </Button>
              <Button 
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Eliminar Cuenta
              </Button>
            </div>
          )}
          {editing && (
            <div className="user-actions">
              <Button 
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                className="edit-profile-button"
              >
                Guardar
              </Button>
              <Button 
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <div className="user-detail-layout">
          {/* User Profile Card */}
          <div className="user-profile-card">
            <div className="user-profile-header">
              <Avatar className="user-avatar" alt={user.name}>
                {user.name.charAt(0)}
              </Avatar>
              {editing ? (
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={editedUser.name || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography className="user-name">{user.name}</Typography>
              )}
              <Typography className="user-username">{user.email}</Typography>
            </div>
            <div className="user-profile-content">
              {error && (
                <Alert severity="error" style={{ marginBottom: "16px" }}>
                  {error}
                </Alert>
              )}
              <div className="user-info-item">
                <Typography className="user-info-label">Email</Typography>
                {editing ? (
                  <TextField
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  />
                ) : (
                  <Typography className="user-info-value">{user.email}</Typography>
                )}
              </div>
              <div className="user-info-item">
                <Typography className="user-info-label">Teléfono</Typography>
                {editing ? (
                  <TextField
                    name="phone"
                    value={editedUser.phone || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  />
                ) : (
                  <Typography className="user-info-value">{user.phone || 'No especificado'}</Typography>
                )}
              </div>
              <div className="user-info-item">
                <Typography className="user-info-label">Cuenta creada el</Typography>
                <Typography className="user-info-value">
                  {new Date(user.registrationDate).toLocaleDateString()}
                </Typography>
              </div>
            </div>
          </div>

          {/* User Stats and Data */}
          <div className="user-detail-sections">
            <div className="user-section">
              <div className="user-section-header">
                <Typography className="user-section-title">Mis direcciones</Typography>
              </div>
              <div className="user-section-content">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/my-addresses')} 
                >
                  Ver mis direcciones
                </Button>
              </div>
            </div>
            
            <div className="user-section">
              <div className="user-section-header">
                <Typography className="user-section-title">Mis productos</Typography>
              </div>
              <div className="user-section-content">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/my-products')} 
                >
                  Ver mis productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
