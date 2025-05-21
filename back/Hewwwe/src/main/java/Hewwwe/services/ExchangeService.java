package Hewwwe.services;

import Hewwwe.entity.Exchange;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExchangeService {
    Exchange createExchange(Exchange exchange);
    Exchange getExchangeById(Long id);
    Exchange updateExchange(Exchange exchange);
    void deleteExchange(Long id);
    List<Exchange> getAllExchanges();
    List<Exchange> getExchangesByRequesterId(Long requesterId);
    List<Exchange> getExchangesByOwnerId(Long ownerId);
    Exchange updateExchangeStatus(Long id, String status);
    Exchange proposeExchange(Long ownerId, Long requesterId, Long ownerProductId, Long requesterProductId);
    
    /**
     * Acepta un intercambio y marca todos los productos involucrados como vendidos (SOLD)
     * 
     * @param id ID del intercambio a aceptar
     * @return El intercambio actualizado
     */
    Exchange acceptExchangeAndMarkProductsAsSold(Long id);
}
