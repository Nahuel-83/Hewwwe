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
  Search as SearchIcon
} from '@mui/icons-material';
import { getAllInvoices, deleteInvoice } from '../../../api/invoices';
import { Invoice } from '../../../types';
import { toast } from 'react-toastify';
import '../../../styles/pages/admin/AdminInvoicesPage.css';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await getAllInvoices();
      setInvoices(response.data);
    } catch (error) {
      toast.error('Error al cargar facturas');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta factura?')) return;
    try {
      await deleteInvoice(id);
      toast.success('Factura eliminada correctamente');
      loadInvoices();
    } catch (error) {
      toast.error('Error al eliminar la factura');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    (invoice.userName.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    invoice.invoiceId.toString().includes(searchTerm)
  );

  return (
    <div className="admin-products-container">
      <div className="admin-products-content">
        <div className="admin-products-header">
          <Typography variant="h4" className="admin-products-title">
            Gestión de Facturas
          </Typography>
          <TextField
            placeholder="Buscar facturas..."
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
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
                  <TableCell>{invoice.invoiceId}</TableCell>
                  <TableCell>{invoice.userName || 'Sin usuario'}</TableCell>
                  <TableCell>
                    {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'Fecha inválida'}
                  </TableCell>
                  <TableCell>{invoice.totalAmount}€</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(invoice.invoiceId)}
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
