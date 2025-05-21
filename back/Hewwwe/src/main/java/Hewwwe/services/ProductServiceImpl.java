package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Category;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.CartRepository;
import Hewwwe.repository.CategoryRepository;
import Hewwwe.repository.ExchangeRepository;
import Hewwwe.repository.ProductRepository;
import Hewwwe.repository.UserRepository;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.dto.ProductCreateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing products.
 * Provides methods for CRUD operations and business logic related to products.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    // Repositories for accessing data
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ExchangeRepository exchangeRepository;

    /**
     * Retrieves all available products.
     * Filters products by status 'AVAILABLE'.
     * 
     * @return List of available product DTOs
     */
    @Override
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAll().stream()
                .filter(product -> "AVAILABLE".equals(product.getStatus()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves all products for admin view.
     * 
     * @return List of all product DTOs
     */
    @Override
    public List<ProductResponseDTO> findAllForAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Saves a new product based on the provided DTO.
     * Validates and sets relationships with User, Category, Cart, and Exchange.
     * 
     * @param productDTO Data transfer object containing product details
     * @return Saved product DTO
     */
    @Override
    public ProductResponseDTO save(ProductCreateDTO productDTO) {

        Product product = Product.builder()
        .name(productDTO.getName())
        .description(productDTO.getDescription())
        .price(productDTO.getPrice())
        .image(productDTO.getImage())
        .size(productDTO.getSize())
        .status(productDTO.getStatus())
        .publicationDate(productDTO.getPublicationDate())
        .build();

        // Validate and set User
        User user = userRepository.findById(productDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        product.setUser(user);

        // Validate and set Category
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setCategory(category);

        // Set Cart if present
        if (productDTO.getCartId() != null) {
            Cart cart = cartRepository.findById(productDTO.getCartId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            product.setCart(cart);
        }

        // Set Exchange if present
        if (productDTO.getExchangeId() != null) {
            Exchange exchange = exchangeRepository.findById(productDTO.getExchangeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
            product.getExchanges().add(exchange);
        }

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    /**
     * Saves an existing product entity.
     * Validates product existence and updates status if necessary.
     * 
     * @param product Product entity to save
     * @return Saved product DTO
     */
    @Override
    public ProductResponseDTO save(Product product) {
        // Ensure product is not null and has a valid ID
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        
        if (product.getProductId() == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        
        // Verify product exists in the database
        Product existingProduct = productRepository.findById(product.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + product.getProductId()));
        
        // Update status if only status is being changed
        if (product.getStatus() != null && !product.getStatus().equals(existingProduct.getStatus())) {
            existingProduct.setStatus(product.getStatus());
            Product savedProduct = productRepository.save(existingProduct);
            return mapToDTO(savedProduct);
        }
        
        // Build DTO for full update
        var dto = ProductCreateDTO.builder()
            .name(product.getName() != null ? product.getName() : existingProduct.getName())
            .description(product.getDescription() != null ? product.getDescription() : existingProduct.getDescription())
            .price(product.getPrice() != null ? product.getPrice() : existingProduct.getPrice())
            .image(product.getImage() != null ? product.getImage() : existingProduct.getImage())
            .size(product.getSize() != null ? product.getSize() : existingProduct.getSize())
            .status(product.getStatus() != null ? product.getStatus() : existingProduct.getStatus())
            .publicationDate(product.getPublicationDate() != null ? product.getPublicationDate() : existingProduct.getPublicationDate())
            .userId(product.getUser() != null && product.getUser().getUserId() != null ? 
                   product.getUser().getUserId() : existingProduct.getUser().getUserId())
            .categoryId(product.getCategory() != null && product.getCategory().getCategoryId() != null ? 
                       product.getCategory().getCategoryId() : existingProduct.getCategory().getCategoryId())
            .build();
        
        // Copy optional IDs if present
        if (product.getCart() != null && product.getCart().getCartId() != null) {
            dto.setCartId(product.getCart().getCartId());
        } else if (existingProduct.getCart() != null) {
            dto.setCartId(existingProduct.getCart().getCartId());
        }
        
        // Check for exchanges in the existing product
        if (!existingProduct.getExchanges().isEmpty()) {
            // Just take the first exchange ID for backward compatibility
            dto.setExchangeId(existingProduct.getExchanges().get(0).getExchangeId());
        }
        
        return save(dto);
    }

    /**
     * Updates an existing product by ID.
     * Updates fields and relationships if provided.
     * 
     * @param id ID of the product to update
     * @param product Product entity with updated data
     * @return Updated product DTO
     */
    @Override
    public ProductResponseDTO update(Long id, Product product) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    // Update basic fields
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setImage(product.getImage());
                    existingProduct.setSize(product.getSize());
                    existingProduct.setStatus(product.getStatus());

                    // Update relationships if provided
                    if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
                        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                        existingProduct.setCategory(category);
                    }

                    if (product.getCart() != null && product.getCart().getCartId() != null) {
                        Cart cart = cartRepository.findById(product.getCart().getCartId())
                                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
                        existingProduct.setCart(cart);
                    }

                    // Handle exchange relationship if provided
                    if (product.getExchanges() != null && !product.getExchanges().isEmpty() && 
                        product.getExchanges().get(0).getExchangeId() != null) {
                        
                        Exchange exchange = exchangeRepository.findById(product.getExchanges().get(0).getExchangeId())
                                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
                        
                        // Clear existing exchanges and add the new one
                        existingProduct.getExchanges().clear();
                        existingProduct.getExchanges().add(exchange);
                    }

                    Product updatedProduct = productRepository.save(existingProduct);
                    return mapToDTO(updatedProduct);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    /**
     * Deletes a product by ID.
     * 
     * @param id ID of the product to delete
     */
    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Finds products by category ID.
     * 
     * @param categoryId ID of the category
     * @return List of product DTOs in the category
     */
    @Override
    public List<ProductResponseDTO> findByCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> productRepository.findByCategory(category).stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    /**
     * Finds products by user ID.
     * 
     * @param userId ID of the user
     * @return List of product DTOs owned by the user
     */
    @Override
    public List<ProductResponseDTO> findByUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> productRepository.findByUser(user).stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /**
     * Finds products by status.
     * 
     * @param status Status of the products to find
     * @return List of product DTOs with the specified status
     */
    @Override
    public List<ProductResponseDTO> findByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Searches products by keyword in name or description.
     * 
     * @param keyword Keyword to search for
     * @return List of product DTOs matching the keyword
     */
    @Override
    public List<ProductResponseDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Checks if a product exists by ID.
     * 
     * @param id ID of the product
     * @return true if the product exists, false otherwise
     */
    @Override
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    /**
     * Maps a Product entity to a ProductResponseDTO.
     * 
     * @param product Product entity to map
     * @return Mapped product DTO
     */
    private ProductResponseDTO mapToDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setSize(product.getSize());
        dto.setStatus(product.getStatus());
        dto.setPublicationDate(product.getPublicationDate());

        // Map user information
        if (product.getUser() != null) {
            dto.setUserId(product.getUser().getUserId());
            dto.setUserName(product.getUser().getName());
            dto.setUserEmail(product.getUser().getEmail());
        }

        // Map category information
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getName());
        }

        // Map optional IDs
        if (product.getCart() != null) {
            dto.setCartId(product.getCart().getCartId());
        }
        if (product.getExchanges() != null && !product.getExchanges().isEmpty() && 
            product.getExchanges().get(0).getExchangeId() != null) {
            dto.setExchangeId(product.getExchanges().get(0).getExchangeId());
        }

        return dto;
    }
    

    @Override
    public ProductResponseDTO findById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Override
    public UserResponseDTO findUserByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        User user = product.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found for product: " + productId);
        }

        UserResponseDTO userDTO = new UserResponseDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole().toString());
        userDTO.setRegistrationDate(user.getRegistrationDate());
        
        return userDTO;
    }

    @Override
    public Product getEntityById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
