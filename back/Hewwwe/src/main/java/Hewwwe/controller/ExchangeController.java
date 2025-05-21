package Hewwwe.controller;

import Hewwwe.dto.ExchangeCreateDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Exchange;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.ExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.Arrays;

/**
 * REST Controller that handles product exchange operations.
 * Manages the creation, updating, and tracking of exchanges between users.
 */
@RestController
@RequestMapping("/api/exchanges")
@RequiredArgsConstructor
@Tag(name = "Exchange Controller", description = "Exchange management endpoints")
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final ModelMapper modelMapper;

    /**
     * Retrieves all exchanges registered in the system.
     *
     * @return ResponseEntity containing the list of exchanges
     */
    @GetMapping
    @Operation(summary = "Get all exchanges")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getAllExchanges() {
        List<ExchangeResponseDTO> exchanges = exchangeService.getAllExchanges().stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Retrieves a specific exchange by its ID.
     *
     * @param id ID of the exchange
     * @return ResponseEntity containing the found exchange
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get an exchange by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> getExchangeById(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        return ResponseEntity.ok(modelMapper.map(exchange, ExchangeResponseDTO.class));
    }

    /**
     * Proposes an exchange between two users with specific products.
     *
     * @param request Data for the exchange proposal
     * @return ResponseEntity with the created exchange
     */
    @PostMapping
    @Operation(summary = "Propose an exchange between users")
    @ApiResponse(responseCode = "201", description = "Exchange proposed successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<ExchangeResponseDTO> proposeExchange(@RequestBody Map<String, Object> request) {
        try {
            Long ownerId = Long.valueOf(request.get("ownerId").toString());
            Long requesterId = Long.valueOf(request.get("requesterId").toString());
            Long ownerProductId = Long.valueOf(request.get("ownerProductId").toString());
            Long requesterProductId = Long.valueOf(request.get("requesterProductId").toString());
            
            // Crear el DTO con los datos necesarios
            ExchangeCreateDTO exchangeDTO = new ExchangeCreateDTO();
            exchangeDTO.setStatus("PENDING");
            exchangeDTO.setExchangeDate(new Date());
            exchangeDTO.setOwnerId(ownerId);
            exchangeDTO.setRequesterId(requesterId);
            exchangeDTO.setProductIds(Arrays.asList(ownerProductId, requesterProductId));
            
            // Crear y guardar el intercambio
            Exchange exchange = exchangeService.proposeExchange(
                ownerId, 
                requesterId, 
                ownerProductId, 
                requesterProductId
            );
            
            return new ResponseEntity<>(modelMapper.map(exchange, ExchangeResponseDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error proposing exchange: " + e.getMessage());
        }
    }

    /**
     * Actualiza un intercambio existente.
     *
     * @param id ID del intercambio a actualizar
     * @param exchangeDTO DTO con los datos actualizados del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing exchange")
    @ApiResponse(responseCode = "200", description = "Exchange updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> updateExchange(
            @PathVariable Long id,
            @Valid @RequestBody ExchangeResponseDTO exchangeDTO) {
        try {
            Exchange exchange = modelMapper.map(exchangeDTO, Exchange.class);
            Exchange updatedExchange = exchangeService.updateExchange(exchange);
            return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating exchange: " + e.getMessage());
        }
    }

    /**
     * Elimina un intercambio.
     *
     * @param id ID del intercambio a eliminar
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an exchange")
    @ApiResponse(responseCode = "204", description = "Exchange deleted successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<Void> deleteExchange(@PathVariable Long id) {
        exchangeService.deleteExchange(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene los intercambios solicitados por un usuario.
     *
     * @param userId ID del usuario solicitante
     * @return ResponseEntity con la lista de intercambios solicitados
     */
    @GetMapping("/user/{userId}/requested")
    @Operation(summary = "Get exchanges requested by a user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's requested exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getExchangesByRequesterId(@PathVariable Long userId) {
        List<ExchangeResponseDTO> exchanges = exchangeService.getExchangesByRequesterId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Obtiene los intercambios donde el usuario es el propietario.
     *
     * @param userId ID del usuario propietario
     * @return ResponseEntity con la lista de intercambios donde el usuario es propietario
     */
    @GetMapping("/user/{userId}/owned")
    @Operation(summary = "Get exchanges where user is the owner")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's owned exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getExchangesByOwnerId(@PathVariable Long userId) {
        List<ExchangeResponseDTO> exchanges = exchangeService.getExchangesByOwnerId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Obtiene todos los productos en un intercambio.
     *
     * @param id ID del intercambio
     * @return ResponseEntity con la lista de productos en el intercambio
     */
    @GetMapping("/{id}/products")
    @Operation(summary = "Get all products in an exchange")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange products")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByExchange(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        if (exchange == null) {
            throw new ResourceNotFoundException("Exchange not found with id: " + id);
        }
        
        List<ProductResponseDTO> products = exchange.getProducts().stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .toList();
        
        return ResponseEntity.ok(products);
    }

    /**
     * Actualiza el estado de un intercambio.
     *
     * @param id ID del intercambio
     * @param status Nuevo estado del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "Update exchange status")
    @ApiResponse(responseCode = "200", description = "Exchange status updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> updateExchangeStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Exchange updatedExchange = exchangeService.updateExchangeStatus(id, status);
        return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
    }

    /**
     * Acepta un intercambio propuesto.
     *
     * @param id ID del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept an exchange proposal")
    @ApiResponse(responseCode = "200", description = "Exchange accepted successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> acceptExchange(@PathVariable Long id) {
        try {
            Exchange updatedExchange = exchangeService.acceptExchangeAndMarkProductsAsSold(id);
            return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error accepting exchange: " + e.getMessage());
        }
    }

    /**
     * Rechaza un intercambio propuesto.
     *
     * @param id ID del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject an exchange proposal")
    @ApiResponse(responseCode = "200", description = "Exchange rejected successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> rejectExchange(@PathVariable Long id) {
        try {
            Exchange updatedExchange = exchangeService.updateExchangeStatus(id, "REJECTED");
            return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error rejecting exchange: " + e.getMessage());
        }
    }

    /**
     * Obtiene todos los intercambios de un usuario (solicitados y donde es propietario).
     *
     * @param userId ID del usuario
     * @return ResponseEntity con la lista de todos los intercambios del usuario
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all exchanges for a user (both requested and owned)")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getUserExchanges(@PathVariable Long userId) {
        List<Exchange> requestedExchanges = exchangeService.getExchangesByRequesterId(userId);
        List<Exchange> ownedExchanges = exchangeService.getExchangesByOwnerId(userId);
        
        // Combinar las listas y eliminar duplicados
        List<Exchange> allExchanges = new java.util.ArrayList<>(requestedExchanges);
        for (Exchange exchange : ownedExchanges) {
            if (!allExchanges.contains(exchange)) {
                allExchanges.add(exchange);
            }
        }
        
        List<ExchangeResponseDTO> exchangeDTOs = new java.util.ArrayList<>();
        
        for (Exchange exchange : allExchanges) {
            ExchangeResponseDTO dto = modelMapper.map(exchange, ExchangeResponseDTO.class);
            
            // Mapear manualmente productos para incluir información completa
            List<ProductResponseDTO> productDTOs = exchange.getProducts().stream()
                .map(product -> {
                    ProductResponseDTO productDTO = modelMapper.map(product, ProductResponseDTO.class);
                    productDTO.setUserId(product.getUser().getUserId());
                    return productDTO;
                })
                .toList();
            
            dto.setProducts(productDTOs);
            dto.setOwnerName(exchange.getOwner().getUsername());
            dto.setRequesterName(exchange.getRequester().getUsername());
            dto.setOwnerId(exchange.getOwner().getUserId());
            dto.setRequesterId(exchange.getRequester().getUserId());
            
            exchangeDTOs.add(dto);
        }
        
        return ResponseEntity.ok(exchangeDTOs);
    }
}
