import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/pages/forms.css';
import { createAddress, getAddressById, updateAddress } from '../../../api/addresses';
import type { AddressCreateDTO } from '../../../types/dtos';
import { toast } from 'react-toastify';

export default function AddressForm() {
  const [address, setAddress] = useState<Partial<AddressCreateDTO>>({
    street: '',
    number: '',
    city: '',
    country: '',
    postalCode: '',
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadAddress(parseInt(id));
    }
  }, [id]);

  const loadAddress = async (addressId: number) => {
    try {
      const response = await getAddressById(addressId);
      setAddress(response.data);
    } catch (error) {
      toast.error('Error al cargar dirección');
      navigate('/admin/addresses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && id) {
        await updateAddress(parseInt(id), address as AddressCreateDTO);
        toast.success('Dirección actualizada');
      } else {
        // Aquí deberías obtener el userId de algún contexto de autenticación
        const userId = 1; // Ejemplo
        await createAddress({
          ...address,
          userId,
        } as AddressCreateDTO);        
        toast.success('Dirección creada');
      }
      navigate('/admin/addresses');
    } catch (error) {
      toast.error('Error al guardar dirección');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">
          {isEditing ? 'Editar Dirección' : 'Nueva Dirección'}
        </h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="street" className="form-label">Calle</label>
            <input
              id="street"
              type="text"
              name="street"
              className="form-input"
              value={address.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number" className="form-label">Número</label>
            <input
              id="number"
              type="text"
              name="number"
              className="form-input"
              value={address.number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city" className="form-label">Ciudad</label>
            <input
              id="city"
              type="text"
              name="city"
              className="form-input"
              value={address.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country" className="form-label">País</label>
            <input
              id="country"
              type="text"
              name="country"
              className="form-input"
              value={address.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode" className="form-label">Código Postal</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              className="form-input"
              value={address.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="form-button form-button-secondary"
              onClick={() => navigate('/admin/addresses')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="form-button form-button-primary"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
