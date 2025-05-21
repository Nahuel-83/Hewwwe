/**
 * Package containing the application's controllers
 */
package Hewwwe.controller;

import Hewwwe.dto.ProductCreateDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.ProductUpdateDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.Product;
import Hewwwe.services.ProductService;
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

/**
 * REST controller that handles operations related to products.
 * Provides endpoints for complete product management in the application.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Controller", description = "Product management endpoints")
public class ProductController {
    /**
     * Service containing business logic for products
     */
    private final ProductService productService;

    /**
     * Mapper for converting between entities and DTOs
     */
    private final ModelMapper modelMapper;

    /**
     * Retrieves all available products
     * 
     * @return List of available products
     */
    @GetMapping
    @Operation(summary = "Get all available products")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved available products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }
    
    /**
     * Retrieves all products (including sold ones) - Admin only
     * 
     * @return Complete list of products
     */
    @GetMapping("/admin/all")
    @Operation(summary = "Get all products including sold ones (Admin only)")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.findAllForAdmin());
    }

    /**
     * Retrieves a specific product by its ID
     * 
     * @param id ID of the product to find
     * @return Found product
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved product")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    /**
     * Retrieves the user details of a product owner
     * 
     * @param id ID of the product
     * @return Owner user details
     */
    @GetMapping("/{id}/user")
    @Operation(summary = "Get product's user details")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user")
    @ApiResponse(responseCode = "404", description = "Product or user not found")
    public ResponseEntity<UserResponseDTO> getProductUser(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findUserByProductId(id));
    }

    /**
     * Creates a new product
     * 
     * @param productDTO Data of the product to create
     * @return Created product
     */
    @PostMapping
    @Operation(summary = "Create a new product")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductCreateDTO productDTO) {
        ProductResponseDTO savedProduct = productService.save(productDTO);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    /**
     * Updates an existing product
     * 
     * @param id ID of the product to update
     * @param updateDTO Updated product data
     * @return Updated product
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    @ApiResponse(responseCode = "200", description = "Product updated successfully")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO updateDTO) {
        Product product = modelMapper.map(updateDTO, Product.class);
        return ResponseEntity.ok(productService.update(id, product));
    }

    /**
     * Deletes a product
     * 
     * @param id ID of the product to delete
     * @return No content response
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    @ApiResponse(responseCode = "204", description = "Product deleted successfully")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves products by category
     * 
     * @param categoryId ID of the category
     * @return List of products in the category
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.findByCategory(categoryId));
    }

    /**
     * Retrieves products by user
     * 
     * @param userId ID of the user
     * @return List of user's products
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get products by user")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(productService.findByUser(userId));
    }

    /**
     * Retrieves products by status
     * 
     * @param status Product status
     * @return List of products with the specified status
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Get products by status")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(productService.findByStatus(status));
    }

    /**
     * Searches products by keyword
     * 
     * @param keyword Keyword for search
     * @return List of products matching the search
     */
    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
}
