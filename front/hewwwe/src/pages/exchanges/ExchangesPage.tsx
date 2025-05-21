/**
 * Exchanges Page Component
 * 
 * Displays and manages product exchange proposals between users in the HEWWWE platform.
 * This page allows users to view, accept, and reject exchange proposals for their products.
 * 
 * Features:
 * - Tabbed interface to filter exchanges by status (All, Pending, Accepted, Rejected)
 * - Displays exchange details including both products involved in the exchange
 * - Shows user information for both parties in the exchange
 * - Provides action buttons for accepting/rejecting exchanges when appropriate
 * - Visual indicators for exchange status with color-coded chips
 * - Responsive design for both desktop and mobile views
 * 
 * The page handles different views based on whether the current user is the owner of the
 * product being requested or the requester proposing the exchange.
 */

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CircularProgress, 
  Button, 
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExchanges, acceptExchange, rejectExchange } from '../../api/exchanges';
import { Exchange } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/ExchangesPage.css';

/**
 * Exchanges page component that displays and manages product exchange proposals
 * @returns Exchanges page component with tabbed interface and exchange cards
 */
const ExchangesPage = () => {
  const [loading, setLoading] = useState(true);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadExchanges();
  }, [user]);

  /**
   * Loads all exchanges related to the current user from the API
   * Handles data validation, logging, and error states
   */
  const loadExchanges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getUserExchanges(user.userId);
      console.log('Exchanges raw response:', JSON.stringify(response.data, null, 2));
      
      // Check if data is valid
      if (Array.isArray(response.data)) {
        // Log key details of first exchange for debugging
        if (response.data.length > 0) {
          const firstExchange = response.data[0];
          console.log('First exchange owner details:', {
            ownerId: firstExchange.ownerId,
            owner: firstExchange.owner,
            ownerName: firstExchange.ownerName
          });
          console.log('First exchange requester details:', {
            requesterId: firstExchange.requesterId,
            requester: firstExchange.requester,
            requesterName: firstExchange.requesterName
          });
          console.log('First exchange status:', firstExchange.status);
          console.log('First exchange products:', firstExchange.products);
        }
        
        setExchanges(response.data);
      } else {
        console.error('Invalid exchange data format:', response.data);
        toast.error('Error: Formato de datos inválido');
        setExchanges([]);
      }
    } catch (error) {
      console.error('Error loading exchanges:', error);
      toast.error('Error al cargar los intercambios');
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles tab selection change to filter exchanges by status
   * @param event React synthetic event from tab change
   * @param newValue Index of the selected tab
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  /**
   * Accepts an exchange proposal
   * @param exchangeId ID of the exchange to accept
   * Updates the exchange status and reloads the exchanges list
   */
  const handleAcceptExchange = async (exchangeId: number) => {
    try {
      console.log('Accepting exchange:', exchangeId);
      const response = await acceptExchange(exchangeId);
      console.log('Accept response:', response);
      toast.success('Intercambio aceptado correctamente');
      loadExchanges();
    } catch (error) {
      console.error('Error accepting exchange:', error);
      toast.error('Error al aceptar el intercambio');
    }
  };

  /**
   * Rejects an exchange proposal
   * @param exchangeId ID of the exchange to reject
   * Updates the exchange status and reloads the exchanges list
   */
  const handleRejectExchange = async (exchangeId: number) => {
    try {
      console.log('Rejecting exchange:', exchangeId);
      const response = await rejectExchange(exchangeId);
      console.log('Reject response:', response);
      toast.success('Intercambio rechazado');
      loadExchanges();
    } catch (error) {
      console.error('Error rejecting exchange:', error);
      toast.error('Error al rechazar el intercambio');
    }
  };

  // Filtrar intercambios según la pestaña seleccionada
  const filteredExchanges = exchanges && exchanges.length > 0 ? exchanges.filter(exchange => {
    if (!exchange.status) return false;
    
    if (tabValue === 0) return true; // Todos
    if (tabValue === 1) return exchange.status === 'PENDING'; // Pendientes
    if (tabValue === 2) return exchange.status === 'ACCEPTED' || exchange.status === 'COMPLETED'; // Aceptados
    if (tabValue === 3) return exchange.status === 'REJECTED'; // Rechazados
    return false;
  }) : [];

  /**
   * Determines if the current user is the owner or requester in an exchange
   * @param exchange Exchange object to check roles for
   * @returns 'owner' if user owns the requested product, 'requester' if user is proposing the exchange, or 'unknown'
   */
  const getExchangeRole = (exchange: Exchange) => {
    if (!user || !exchange) return 'unknown';
    
    // Check for both property names to ensure backwards compatibility
    const exchangeOwnerId = exchange.ownerId || exchange.owner;
    const exchangeRequesterId = exchange.requesterId || exchange.requester;
    
    console.log('Exchange owner ID:', exchangeOwnerId, 'Current user ID:', user.userId);
    console.log('Exchange requester ID:', exchangeRequesterId);
    
    return exchangeOwnerId === user.userId ? 'owner' : 'requester';
  };

  if (loading) {
    return (
      <div className="exchanges-page-container">
        <div className="exchanges-content">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="exchanges-page-container">
      <div className="exchanges-content">
        <div className="exchanges-header">
          <Typography variant="h4" className="exchanges-title">
            Mis Intercambios
          </Typography>
        </div>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="TODOS" />
          <Tab label="PENDIENTES" />
          <Tab label="ACEPTADOS" />
          <Tab label="RECHAZADOS" />
        </Tabs>

        {!filteredExchanges || filteredExchanges.length === 0 ? (
          <div className="no-exchanges-message">
            <Alert severity="info">
              No tienes intercambios {tabValue === 1 ? 'pendientes' : 
                                tabValue === 2 ? 'aceptados' : 
                                tabValue === 3 ? 'rechazados' : ''}
            </Alert>
          </div>
        ) : (
          <div className="exchanges-grid">
            {filteredExchanges.map((exchange) => {
              if (!exchange) return null;
              
              const userRole = getExchangeRole(exchange);
              const isPending = exchange.status === 'PENDING';
              const isOwner = userRole === 'owner';
              
              console.log('Exchange #', exchange.exchangeId, 'Role:', userRole, 'isPending:', isPending);
              
              return (
                <Card className="exchange-card" key={exchange.exchangeId}>
                  <div className="exchange-header">
                    <Typography variant="h6">
                      Intercambio #{exchange.exchangeId}
                    </Typography>
                    <Chip 
                      label={exchange.status} 
                      color={
                        exchange.status === 'PENDING' ? 'warning' :
                        exchange.status === 'ACCEPTED' ? 'success' :
                        exchange.status === 'COMPLETED' ? 'success' :
                        'error'
                      }
                      size="small"
                    />
                  </div>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Propuesto el {exchange.exchangeDate ? new Date(exchange.exchangeDate).toLocaleDateString() : 'Fecha desconocida'}
                    {exchange.completionDate && (
                      <> • Completado el {new Date(exchange.completionDate).toLocaleDateString()}</>
                    )}
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {!exchange.products || exchange.products.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No hay información de productos disponible para este intercambio
                    </Alert>
                  ) : (
                    <div className="exchange-products-container">
                      <div className="exchange-product-column">
                        <Typography variant="subtitle2" gutterBottom>
                          {isOwner ? 'Te ofrecen:' : 'Tú ofreces:'}
                        </Typography>
                        
                        {exchange.products && exchange.products
                          .filter(p => {
                            if (!p) return false;
                            const exchangeRequesterId = exchange.requesterId || exchange.requester;
                            const exchangeOwnerId = exchange.ownerId || exchange.owner;
                            return p.userId === (isOwner ? exchangeRequesterId : exchangeOwnerId);
                          })
                          .map(product => (
                          <div className="product-item" key={product.productId}>
                            <img 
                              src={product.image || '/placeholder.jpg'} 
                              alt={product.name}
                              className="product-image"
                            />
                            <div className="product-details">
                              <Typography variant="subtitle2">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.price?.toLocaleString('es-ES', { 
                                  style: 'currency', 
                                  currency: 'EUR'
                                })}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="exchange-product-column">
                        <Typography variant="subtitle2" gutterBottom>
                          {isOwner ? 'A cambio de tu:' : 'A cambio de:'}
                        </Typography>
                        
                        {exchange.products && exchange.products
                          .filter(p => {
                            if (!p) return false;
                            const exchangeRequesterId = exchange.requesterId || exchange.requester;
                            const exchangeOwnerId = exchange.ownerId || exchange.owner;
                            return p.userId === (isOwner ? exchangeOwnerId : exchangeRequesterId);
                          })
                          .map(product => (
                          <div className="product-item" key={product.productId}>
                            <img 
                              src={product.image || '/placeholder.jpg'} 
                              alt={product.name}
                              className="product-image"
                            />
                            <div className="product-details">
                              <Typography variant="subtitle2">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.price?.toLocaleString('es-ES', { 
                                  style: 'currency', 
                                  currency: 'EUR'
                                })}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isPending && isOwner && (
                    <div className="exchange-actions">
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="large"
                        onClick={() => handleRejectExchange(exchange.exchangeId)}
                      >
                        Rechazar Intercambio
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        onClick={() => handleAcceptExchange(exchange.exchangeId)}
                      >
                        Aceptar Intercambio
                      </Button>
                    </div>
                  )}
                  
                  {isPending && !isOwner && (
                    <div className="exchange-actions">
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Esperando respuesta del propietario
                      </Typography>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangesPage;
