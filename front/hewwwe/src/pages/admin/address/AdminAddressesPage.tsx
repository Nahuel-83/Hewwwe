import { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllAddresses, deleteAddress } from '../../../api/addresses';
import { Address } from '../../../types';
import { toast } from 'react-toastify';
import '../../../styles/pages/admin/AdminExchangesPage.css';

/**
 * Admin Addresses Page Component
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
export default function AdminAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (!window.confirm('¿Estás seguro de eliminar esta dirección?')) return;
    try {
      await deleteAddress(id);
      toast.success('Dirección eliminada correctamente');
      loadAddresses();
    } catch (error) {
      toast.error('Error al eliminar la dirección');
    }
  };


  const term = searchTerm?.toLowerCase() ?? '';

  const filteredAddress = addresses.filter(address => {
    const requesterName = address?.addressId?
        address?.addressId.toString().toLowerCase() : '';

    const userId = address.userId?
    address.userId?.toString().toLowerCase() : '';
    return (
      requesterName.includes(term) ||
      userId.includes(term)
    );
  });

  return (
    <div className="admin-products-container">
      <div className="admin-products-content">
        <div className="admin-products-header">
          <Typography variant="h4" className="admin-products-title">
            Gestión de Direcciones
          </Typography>
          <TextField
            placeholder="Buscar direcciones..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Calle</TableCell>
                <TableCell>Numero</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>País</TableCell>
                <TableCell>Código Postal</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAddress.map((address) => (
                <TableRow key={address.addressId}>
                  <TableCell>{address.addressId}</TableCell>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.number}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.country}</TableCell>
                  <TableCell>{address.postalCode}</TableCell>
                  <TableCell>{address.userName}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/admin/addresses/${address.addressId}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(address.addressId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
