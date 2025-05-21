import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { getAllUsers, deleteUser } from '../../api/users';
import type { User } from '../../types';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      // Error handling is now done in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.userId !== id));
      toast.success('Usuario eliminado');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Usuarios</Typography>
        <Button variant="contained" onClick={() => navigate('/users/new')}>
          Nuevo Usuario
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {users.map((user) => (
          <Card key={user.userId} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Chip 
                label={user.role}
                color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <IconButton onClick={() => navigate(`/users/${user.userId}/cart`)}>
                  <CartIcon />
                </IconButton>
                <IconButton onClick={() => navigate(`/users/${user.userId}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.userId)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
