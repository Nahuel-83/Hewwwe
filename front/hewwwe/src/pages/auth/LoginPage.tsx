import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';
import { toast } from 'react-toastify';
import '../../styles/pages/auth/Login.css';

interface LoginFormData {
  nameOrEmail: string;
  password: string;
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginFormData>({
    nameOrEmail: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      
      if (response.data.success) {
        authLogin(response.data.data);
        toast.success('¡Bienvenido!');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <Paper className="login-form">
        <Typography className="login-title">
          Bienvenido
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de Usuario o Email"
            name="nameOrEmail"
            value={credentials.nameOrEmail}
            onChange={(e) => setCredentials({ ...credentials, nameOrEmail: e.target.value })}
            className="login-input"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="login-input"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-button"
          >
            Iniciar Sesión
          </Button>
        </form>
        <Box className="register-link">
          <Typography variant="body2">
            ¿No tienes una cuenta?{' '}
            <Link component={RouterLink} to="/register" color="primary" sx={{ fontWeight: 600 }}>
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
