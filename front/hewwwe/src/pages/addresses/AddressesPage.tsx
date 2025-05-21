import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getAllAddresses, deleteAddress } from '../../api/addresses';
import type { AddressResponseDTO } from '../../types/dtos';
import { toast } from 'react-toastify';

/**
 * Addresses Page Component
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
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await getAllAddresses();
      setAddresses(response.data);
    } catch (error) {
      toast.error('Error al cargar direcciones');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta dirección?')) {
      try {
        await deleteAddress(id);
        toast.success('Dirección eliminada');
        loadAddresses();
      } catch (error) {
        toast.error('Error al eliminar dirección');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Direcciones</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/addresses/new')}
        >
          Nueva Dirección
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {addresses.map(address => (
          <Card key={address.addressId}>
            <CardContent>
              <Typography variant="h6">{address.street} {address.number}</Typography>
              <Typography color="textSecondary">{address.city}</Typography>
              <Typography>{address.country}</Typography>
              <Typography>CP: {address.postalCode}</Typography>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => navigate(`/addresses/${address.addressId}/edit`)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  color="error"
                  onClick={() => handleDelete(address.addressId)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
