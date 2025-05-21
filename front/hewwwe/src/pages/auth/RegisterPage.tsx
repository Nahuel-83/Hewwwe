import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register, RegisterRequest } from '../../api/auth';
import { toast } from 'react-toastify';
import '../../styles/pages/auth/Register.css';  

export default function RegisterPage() {
  const [userData, setUserData] = useState<RegisterRequest>({
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
      postalCode: ''
    }
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(userData);
      toast.success('Registro exitoso');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="register-container">
      <Paper className="register-form">
        <Typography className="register-title">
          Crear Cuenta
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box className="register-form-content">
            <Box className="form-field-full">
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </Box>

            <Box className="form-field-half">
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </Box>

            <Box className="form-field-half">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Box>

            <Box className="form-field-full">
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              />
            </Box>
            <Box className="form-field-full">
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </Box>

            <Typography className="register-section-title">
              Dirección Principal
            </Typography>

            <Box className="form-field-full">
              <TextField
                fullWidth
                label="Calle"
                name="street"
                value={userData.address.street}
                onChange={(e) => setUserData({ ...userData, address: { ...userData.address, street: e.target.value } })}
              />
            </Box>
            <Box className="form-field-half">
              <TextField
                fullWidth
                label="Número"
                name="number"
                value={userData.address.number}
                onChange={(e) => setUserData({ ...userData, address: { ...userData.address, number: e.target.value } })}
              />
            </Box>
            <Box className="form-field-half">
              <TextField
                fullWidth
                label="Código Postal"
                name="postalCode"
                value={userData.address.postalCode}
                onChange={(e) => setUserData({ ...userData, address: { ...userData.address, postalCode: e.target.value } })}
              />
            </Box>
            <Box className="form-field-half">
              <TextField
                fullWidth
                label="Ciudad"
                name="city"
                value={userData.address.city}
                onChange={(e) => setUserData({ ...userData, address: { ...userData.address, city: e.target.value } })}
              />
            </Box>
            <Box className="form-field-half">
              <TextField
                fullWidth
                label="País"
                name="country"
                value={userData.address.country}
                onChange={(e) => setUserData({ ...userData, address: { ...userData.address, country: e.target.value } })}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="register-button"
          >
            Crear Cuenta
          </Button>
        </form>
      </Paper>
    </div>
  );
}
