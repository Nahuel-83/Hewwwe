import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { register } from '../../api/auth'; 
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    address: {
      street: '',
      number: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Register</Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Address</Typography>
            </Box>
            
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Street"
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Number"
                name="number"
                value={formData.address.number}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.address.country}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                required
              />
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => navigate('/login')}>
              Already have an account? Login
            </Button>
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
