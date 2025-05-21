/**
 * Address Selector Component
 * 
 * Dropdown component that allows users to select from their saved addresses.
 * Fetches all available addresses for the authenticated user and displays them in a select menu.
 * 
 * Features:
 * - Auto-loads addresses on component mount
 * - Displays addresses in a formatted manner (street, number, city)
 * - Provides a button to confirm address selection
 * - Disables confirmation button until an address is selected
 * - Communicates the selected address ID to parent components via callback
 * 
 * Used in checkout flows, user profile management, and anywhere address selection is required.
 */

import { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box 
} from '@mui/material';
import { getAllAddresses } from '../api/addresses';
import type { AddressResponseDTO } from '../types/dtos';

/**
 * Props for the AddressSelector component
 */
interface AddressSelectorProps {
  /** Callback function triggered when an address is selected and confirmed */
  onSelect: (addressId: number) => void;
}

/**
 * Component for selecting an address from the user's saved addresses
 */
export default function AddressSelector({ onSelect }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | ''>('');

  useEffect(() => {
    loadAddresses();
  }, []);

  /**
   * Fetches all addresses for the current user from the API
   */
  const loadAddresses = async () => {
    try {
      const response = await getAllAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  return (
    <Box sx={{ minWidth: 300, p: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Dirección</InputLabel>
        <Select
          value={selectedAddress}
          label="Dirección"
          onChange={(e) => setSelectedAddress(e.target.value as number)}
        >
          {addresses.map((address) => (
            <MenuItem key={address.addressId} value={address.addressId}>
              {`${address.street}, ${address.number} - ${address.city}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        fullWidth
        disabled={!selectedAddress}
        onClick={() => selectedAddress && onSelect(selectedAddress)}
      >
        Vincular Dirección
      </Button>
    </Box>
  );
}
