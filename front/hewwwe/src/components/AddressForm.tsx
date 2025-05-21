/**
 * Address Form Component
 * 
 * Form component for creating and editing user addresses in the HEWWWE application.
 * Provides a complete form with validation for all address fields required in the system.
 * 
 * Features:
 * - Support for both creation and editing of addresses
 * - Form validation for required fields
 * - Consistent styling with the application's design system
 * - Controlled form inputs with state management
 * - Callback pattern for form submission handling
 * 
 * Used in user profile management, checkout process, and admin address management.
 */

import { useState } from 'react';
import '../pages/forms.css';
import type { Address } from '../types';

/**
 * Props for the AddressForm component
 */
interface AddressFormProps {
  /** Callback function triggered when the form is submitted with valid data */
  onSubmit: (address: Partial<Address>) => void;
  /** Optional initial data for editing an existing address */
  initialData?: Partial<Address>;
}

/**
 * Form component for creating and editing address information
 */
export default function AddressForm({ onSubmit, initialData }: AddressFormProps) {
  const [address, setAddress] = useState<Partial<Address>>(initialData || {
    street: '',
    number: '',
    city: '',
    country: '',
    postalCode: ''
  });

  /**
   * Handles form submission, prevents default behavior and passes address data to the onSubmit callback
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">Dirección</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="street" className="form-label">Calle</label>
            <input
              id="street"
              type="text"
              name="street"
              className="form-input"
              value={address.street}
              onChange={e => setAddress({ ...address, street: e.target.value })}
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
              onChange={e => setAddress({ ...address, number: e.target.value })}
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
              onChange={e => setAddress({ ...address, city: e.target.value })}
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
              onChange={e => setAddress({ ...address, country: e.target.value })}
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
              onChange={e => setAddress({ ...address, postalCode: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="form-button form-button-primary" style={{width: '100%'}}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
