import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Card
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import { getUserById, getUserProducts, getUserAddresses, createAddress, linkAddressToUser, unlinkAddressFromUser } from '../../api/users';
import type { User, Product, Address } from '../../types';
import { toast } from 'react-toastify';
import AddressForm from '../../components/AddressForm';
import AddressSelector from '../../components/AddressSelector';
import '../../styles/common/loading.css';
import '../../styles/pages/users/UserDetail.css';

export default function UserDetail() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showLinkAddressDialog, setShowLinkAddressDialog] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadUserData(Number(id));
    }
  }, [id]);

  const loadUserData = async (userId: number) => {
    try {
      setLoading(true);
      const [userResponse, productsResponse, addressesResponse] = await Promise.all([
        getUserById(userId),
        getUserProducts(userId),
        getUserAddresses(userId)
      ]);

      setUser(userResponse.data);
      setProducts(productsResponse.data);
      setAddresses(addressesResponse.data);
    } catch (error) {
      toast.error('Error al cargar los datos del usuario');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm('¿Estás seguro de querer eliminar esta dirección?')) return;
    
    try {
      await unlinkAddressFromUser(Number(id), addressId);
      toast.success('Dirección eliminada correctamente');
      loadUserData(Number(id));
    } catch (error) {
      toast.error('Error al eliminar la dirección');
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box className="user-container">
      <Box className="user-header">
        <Typography variant="h4" className="user-title">
          {user.name}
        </Typography>
        <Box className="user-actions">
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/users/${id}/edit`)}
          >
            Editar
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/users')}
          >
            Volver
          </Button>
        </Box>
      </Box>

      <Box className="user-grid">
        {/* Información Personal */}
        <Card elevation={2} sx={{ 
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              Información Personal
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Nombre" 
                  secondary={user.name} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Teléfono" 
                  secondary={user.phone} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Rol" 
                  secondary={
                    <Chip 
                      label={user.role} 
                      color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  }
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Fecha de registro" 
                  secondary={new Date(user.registrationDate).toLocaleDateString()} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Card>

        {/* Direcciones */}
        <Card elevation={2} sx={{ 
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Direcciones</Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddressDialog(true)}
                  startIcon={<AddIcon />}
                >
                  Nueva Dirección
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowLinkAddressDialog(true)}
                  startIcon={<LinkIcon />}
                  sx={{ ml: 1 }}
                >
                  Vincular Dirección
                </Button>
              </Box>
            </Box>

            {/* Dialog para crear nueva dirección */}
            <Dialog open={showAddressDialog} onClose={() => setShowAddressDialog(false)}>
              <DialogTitle>Nueva Dirección</DialogTitle>
              <DialogContent>
                <AddressForm 
                  onSubmit={async (address) => {
                    try {
                      await createAddress(Number(id), address);
                      toast.success('Dirección creada con éxito');
                      loadUserData(Number(id));
                      setShowAddressDialog(false);
                    } catch (error) {
                      toast.error('Error al crear la dirección');
                    }
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Dialog para vincular dirección existente */}
            <Dialog open={showLinkAddressDialog} onClose={() => setShowLinkAddressDialog(false)}>
              <DialogTitle>Vincular Dirección Existente</DialogTitle>
              <DialogContent>
                <AddressSelector 
                  onSelect={async (addressId) => {
                    try {
                      await linkAddressToUser(Number(id), addressId);
                      toast.success('Dirección vinculada con éxito');
                      loadUserData(Number(id));
                      setShowLinkAddressDialog(false);
                    } catch (error) {
                      toast.error('Error al vincular la dirección');
                    }
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Lista de direcciones existentes */}
            <List>
              {addresses.map((address) => (
                <ListItem 
                  key={address.addressId} 
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    p: 2
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {address.street}, {address.number}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users/${id}/addresses/${address.addressId}/edit`);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.addressId);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {address.city}, {address.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CP: {address.postalCode}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Card>

        {/* Productos */}
        <Card elevation={2} sx={{ 
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              Productos
            </Typography>
            <List>
              {products.map((product) => (
                <ListItem 
                  key={product.productId} 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => navigate(`/products/${product.productId}`)}
                >
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="primary.main">
                          {product.price}€
                        </Typography>
                        <Chip 
                          label={product.status} 
                          size="small"
                          color={
                            product.status === 'AVAILABLE' ? 'success' :
                            product.status === 'SOLD' ? 'error' : 'warning'
                          }
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Card>
      </Box>
    </Box>
  );
}
