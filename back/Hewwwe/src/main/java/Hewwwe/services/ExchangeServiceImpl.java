package Hewwwe.services;

import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.ExchangeRepository;
import Hewwwe.repository.ProductRepository;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Implementation of the Exchange Service that handles all exchange-related operations.
 * This service manages the creation, retrieval, update and deletion of exchanges between users.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ExchangeServiceImpl implements ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * Creates a new exchange in the system.
     *
     * @param exchange The exchange entity to be created
     * @return The created exchange
     */
    @Override
    public Exchange createExchange(Exchange exchange) {
        return exchangeRepository.save(exchange);
    }

    /**
     * Retrieves an exchange by its ID.
     *
     * @param id The ID of the exchange to retrieve
     * @return The found exchange
     * @throws ResourceNotFoundException if the exchange is not found
     */
    @Override
    public Exchange getExchangeById(Long id) {
        return exchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + id));
    }

    /**
     * Updates an existing exchange.
     *
     * @param exchange The exchange entity with updated information
     * @return The updated exchange
     * @throws ResourceNotFoundException if the exchange is not found
     */
    @Override
    public Exchange updateExchange(Exchange exchange) {
        if (!exchangeRepository.existsById(exchange.getExchangeId())) {
            throw new ResourceNotFoundException("Exchange not found with id: " + exchange.getExchangeId());
        }
        return exchangeRepository.save(exchange);
    }

    /**
     * Deletes an exchange by its ID.
     *
     * @param id The ID of the exchange to delete
     * @throws ResourceNotFoundException if the exchange is not found
     */
    @Override
    public void deleteExchange(Long id) {
        if (!exchangeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exchange not found with id: " + id);
        }
        exchangeRepository.deleteById(id);
    }

    /**
     * Retrieves all exchanges in the system.
     *
     * @return A list of all exchanges
     */
    @Override
    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }

    /**
     * Retrieves exchanges by the requester's user ID.
     *
     * @param requesterId The ID of the requester
     * @return A list of exchanges for the given requester
     */
    @Override
    public List<Exchange> getExchangesByRequesterId(Long requesterId) {
        return exchangeRepository.findByRequester_UserId(requesterId);
    }

    /**
     * Retrieves exchanges by the owner's user ID.
     *
     * @param ownerId The ID of the owner
     * @return A list of exchanges for the given owner
     */
    @Override
    public List<Exchange> getExchangesByOwnerId(Long ownerId) {
        return exchangeRepository.findByOwner_UserId(ownerId);
    }

    /**
     * Updates the status of an exchange.
     *
     * @param id The ID of the exchange
     * @param status The new status to be set
     * @return The updated exchange
     * @throws ResourceNotFoundException if the exchange is not found
     */
    @Override
    public Exchange updateExchangeStatus(Long id, String status) {
        Exchange exchange = getExchangeById(id);
        exchange.setStatus(status);
        return exchangeRepository.save(exchange);
    }

    /**
     * Accepts an exchange and marks all associated products as sold.
     *
     * @param id The ID of the exchange to accept
     * @return The updated exchange with accepted status
     * @throws ResourceNotFoundException if the exchange is not found
     */
    @Override
    @Transactional
    public Exchange acceptExchangeAndMarkProductsAsSold(Long id) {
        // Obtener el intercambio
        Exchange exchange = getExchangeById(id);
        
        // Cambiar el estado del intercambio a ACCEPTED
        exchange.setStatus("ACCEPTED");
        
        // Marcar todos los productos del intercambio como SOLD
        for (Product product : exchange.getProducts()) {
            product.setStatus("SOLD");
            productRepository.save(product);
        }
        
        // Guardar y devolver el intercambio actualizado
        return exchangeRepository.save(exchange);
    }

    /**
     * Proposes a new exchange between two users with specified products.
     *
     * @param ownerId The ID of the owner user
     * @param requesterId The ID of the requester user
     * @param ownerProductId The ID of the product from the owner
     * @param requesterProductId The ID of the product from the requester
     * @return The created exchange proposal
     * @throws ResourceNotFoundException if any of the users or products are not found
     * @throws IllegalArgumentException if the products do not belong to the specified users
     */
    @Override
    public Exchange proposeExchange(Long ownerId, Long requesterId, Long ownerProductId, Long requesterProductId) {
        // Obtener los usuarios
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found with id: " + requesterId));
        
        // Obtener los productos
        Product ownerProduct = productRepository.findById(ownerProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner product not found with id: " + ownerProductId));
        
        Product requesterProduct = productRepository.findById(requesterProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester product not found with id: " + requesterProductId));
        
        // Validar que los productos pertenezcan a los usuarios correctos
        if (!ownerProduct.getUser().getUserId().equals(ownerId)) {
            throw new IllegalArgumentException("Owner product does not belong to the specified owner");
        }
        
        if (!requesterProduct.getUser().getUserId().equals(requesterId)) {
            throw new IllegalArgumentException("Requester product does not belong to the specified requester");
        }
        
        // Crear el intercambio
        Exchange exchange = new Exchange();
        exchange.setExchangeDate(new Date());
        exchange.setStatus("PENDING");
        exchange.setOwner(owner);
        exchange.setRequester(requester);
        
        // Guardar el intercambio primero para que tenga un ID
        exchange = exchangeRepository.save(exchange);
        
        // Añadir los productos al intercambio
        List<Product> products = new ArrayList<>();
        products.add(ownerProduct);
        products.add(requesterProduct);
        exchange.setProducts(products);
        
        // Actualizar también la relación bidireccional
        ownerProduct.getExchanges().add(exchange);
        requesterProduct.getExchanges().add(exchange);
        
        // Guardar el intercambio actualizado
        return exchangeRepository.save(exchange);
    }
}
