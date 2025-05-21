import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getAllAddresses, updateAddress, deleteAddress, createAddress } from '../../api/addresses';
import { useAuth } from '../../contexts/AuthContext';
import { Address } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/MyAddressesPage.css';

/**
 * My Addresses Page Component
 * 
 * Displays a list of addresses and provides functionality to create, edit, and delete addresses.
 * 
 * Features:
 * - Displays a list of addresses in a card layout
 * - Each address card shows the street, number, city, country, and postal code
 * - Provides options to edit and delete each address
 * - Includes a button to create a new address
 * 
 * The page is protected by the ProtectedRoute component, ensuring that only authenticated users can access it.
 */
export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({
    street: '',
    number: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && user) {
      // Filter addresses to only show those belonging to the current user
      const userAddresses = addresses.filter(address => address.userId === user.userId);
      setFilteredAddresses(userAddresses);
    }
  }, [addresses, user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('No se pudieron cargar las direcciones. Por favor, inténtalo de nuevo más tarde.');
      toast.error('Error al cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setCurrentAddress(address);
      setEditMode(true);
    } else {
      setCurrentAddress({
        street: '',
        number: '',
        city: '',
        country: '',
        postalCode: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async () => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para realizar esta acción');
        return;
      }

      // Validate required fields
      const requiredFields = ['street', 'number', 'city', 'country', 'postalCode'];
      const missingFields = requiredFields.filter(field => !currentAddress[field as keyof typeof currentAddress]);
      
      if (missingFields.length > 0) {
        toast.error('Por favor completa todos los campos obligatorios');
        return;
      }

      setLoading(true);

      if (editMode && currentAddress.addressId) {
        // Update existing address
        await updateAddress(currentAddress.addressId, {
          street: currentAddress.street,
          number: currentAddress.number,
          city: currentAddress.city,
          country: currentAddress.country,
          postalCode: currentAddress.postalCode
        });
        toast.success('Dirección actualizada correctamente');
      } else {
        // Create new address
        await createAddress({
          street: currentAddress.street,
          number: currentAddress.number,
          city: currentAddress.city,
          country: currentAddress.country,
          postalCode: currentAddress.postalCode,
          userId: user.userId
        });
        toast.success('Dirección creada correctamente');
      }

      // Reload addresses
      await loadAddresses();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para realizar esta acción');
        return;
      }

      // Check if this is the last address
      if (filteredAddresses.length <= 1) {
        toast.error('No puedes eliminar tu única dirección');
        return;
      }

      setLoading(true);
      await deleteAddress(addressId);
      toast.success('Dirección eliminada correctamente');
      
      // Reload addresses
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Error al eliminar la dirección');
    } finally {
      setLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="my-addresses-container">
        <div className="my-addresses-content">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-addresses-container">
      <div className="my-addresses-content">
        <div className="my-addresses-header">
          <Typography variant="h4" className="my-addresses-title">
            Mis Direcciones
          </Typography>
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="add-address-button"
          >
            Añadir Dirección
          </Button>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {filteredAddresses.length === 0 ? (
          <Typography>No tienes direcciones registradas.</Typography>
        ) : (
          <div className="my-addresses-grid">
            {filteredAddresses.map((address) => (
              <div key={address.addressId} className="address-card">
                <div className="address-content">
                  <Typography variant="h6" className="address-title">
                    {address.street}, {address.number}
                  </Typography>
                  <div className="address-detail">
                    <span className="address-detail-label">Ciudad:</span> {address.city}
                  </div>
                  <div className="address-detail">
                    <span className="address-detail-label">País:</span> {address.country}
                  </div>
                  <div className="address-detail">
                    <span className="address-detail-label">Código Postal:</span> {address.postalCode}
                  </div>
                </div>
                <div className="address-actions">
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(address)}
                    size="small"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteAddress(address.addressId)}
                    disabled={filteredAddresses.length <= 1}
                    size="small"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog for adding/editing address */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editMode ? 'Editar Dirección' : 'Añadir Dirección'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
              <Box sx={{ gridColumn: 'span 8' }}>
                <TextField
                  fullWidth
                  label="Calle"
                  name="street"
                  value={currentAddress.street || ''}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ gridColumn: 'span 4' }}>
                <TextField
                  fullWidth
                  label="Número"
                  name="number"
                  value={currentAddress.number || ''}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ gridColumn: 'span 6' }}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  name="city"
                  value={currentAddress.city || ''}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ gridColumn: 'span 6' }}>
                <TextField
                  fullWidth
                  label="País"
                  name="country"
                  value={currentAddress.country || ''}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  name="postalCode"
                  value={currentAddress.postalCode || ''}
                  onChange={handleInputChange}
                  required
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              onClick={handleSaveAddress} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
