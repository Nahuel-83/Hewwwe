package Hewwwe.services;

import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.Product;
import Hewwwe.dto.ProductCreateDTO;

import java.util.List;

/**
 * Service interface for managing Product entities.
 * Provides methods for CRUD operations and specialized queries related to products.
 * Implementations of this interface handle the business logic for product management.
 */
public interface ProductService {
    /**
     * Retrieves all available products.
     * 
     * @return List of all available products as DTOs
     */
    List<ProductResponseDTO> findAll();
    /**
     * Retrieves all products including those that are not available (admin view).
     * 
     * @return Complete list of all products as DTOs
     */
    List<ProductResponseDTO> findAllForAdmin();
    /**
     * Finds a product by its ID and returns it as a DTO.
     * 
     * @param id ID of the product to find
     * @return Product as a DTO
     * @throws Hewwwe.exception.ResourceNotFoundException if product not found
     */
    ProductResponseDTO findById(Long id);
    /**
     * Finds a product by its ID and returns the entity object.
     * 
     * @param id ID of the product to find
     * @return Product entity
     * @throws Hewwwe.exception.ResourceNotFoundException if product not found
     */
    Product getEntityById(Long id);
    /**
     * Creates a new product from a DTO.
     * 
     * @param productDTO Data for creating the product
     * @return Created product as a DTO
     * @throws jakarta.validation.ConstraintViolationException if validation fails
     */
    ProductResponseDTO save(ProductCreateDTO productDTO);
    /**
     * Creates a new product from an entity object.
     * 
     * @param product Product entity to save
     * @return Created product as a DTO
     */
    ProductResponseDTO save(Product product);

    /**
     * Updates an existing product.
     * 
     * @param id ID of the product to update
     * @param product Updated product data
     * @return Updated product as a DTO
     * @throws Hewwwe.exception.ResourceNotFoundException if product not found
     */
    ProductResponseDTO update(Long id, Product product);
    /**
     * Deletes a product by its ID.
     * 
     * @param id ID of the product to delete
     * @throws Hewwwe.exception.ResourceNotFoundException if product not found
     */
    void delete(Long id);
    /**
     * Finds all products belonging to a specific category.
     * 
     * @param categoryId ID of the category
     * @return List of products in the category as DTOs
     */
    List<ProductResponseDTO> findByCategory(Long categoryId);
    /**
     * Finds all products belonging to a specific user.
     * 
     * @param userId ID of the user
     * @return List of user's products as DTOs
     */
    List<ProductResponseDTO> findByUser(Long userId);
    /**
     * Finds all products with a specific status.
     * 
     * @param status Status of the products (AVAILABLE, SOLD, RESERVED)
     * @return List of products with the specified status as DTOs
     */
    List<ProductResponseDTO> findByStatus(String status);
    /**
     * Searches for products matching a keyword in name or description.
     * 
     * @param keyword Search term
     * @return List of matching products as DTOs
     */
    List<ProductResponseDTO> searchProducts(String keyword);
    /**
     * Finds the user (owner) of a specific product.
     * 
     * @param productId ID of the product
     * @return Owner user as a DTO
     * @throws Hewwwe.exception.ResourceNotFoundException if product not found
     */
    UserResponseDTO findUserByProductId(Long productId);
    /**
     * Checks if a product exists by its ID.
     * 
     * @param id ID of the product to check
     * @return true if product exists, false otherwise
     */
    boolean existsById(Long id);
}
