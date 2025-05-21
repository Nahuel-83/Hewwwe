package Hewwwe.controller;

/**
 * REST Controller that handles shopping cart operations.
 * Provides endpoints for managing user shopping carts, including adding/removing products and checkout.
 */
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import Hewwwe.services.CartService;
import Hewwwe.services.ProductService;
import Hewwwe.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@Tag(name = "Cart Controller", description = "Cart management endpoints")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;
    private final UserService userService;

    /**
     * Retrieves a user's shopping cart.
     *
     * @param userId ID of the user
     * @return ResponseEntity containing the cart information
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get a user's cart")
    public ResponseEntity<CartResponseDTO> getUserCart(@PathVariable Long userId) {
        System.out.println("Getting cart for user ID: " + userId);
        CartResponseDTO cart = userService.getCartByUserId(userId);
        if (cart != null) {
            System.out.println("Cart found: " + cart.getCartId());
            System.out.println("Product IDs in cart: " + (cart.getProductIds() != null ? cart.getProductIds().size() : "null"));
            if (cart.getProductIds() != null) {
                System.out.println("Product IDs: " + cart.getProductIds());
            }
        } else {
            System.out.println("No cart found for user ID: " + userId);
        }
        return ResponseEntity.ok(cart);
    }

    /**
     * Adds a product to a user's shopping cart.
     *
     * @param userId ID of the user
     * @param productId ID of the product to add
     * @return ResponseEntity with the updated cart or error message
     */
    @PostMapping("/user/{userId}/products/{productId}")
    @Operation(summary = "Add a product to the user's cart")
    public ResponseEntity<?> addToCart(@PathVariable Long userId, @PathVariable Long productId) {
        // Validate productId is not null
        if (productId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Product ID cannot be null or undefined");
        }
        
        try {
            // Attempt to find the product
            Product product = productService.getEntityById(productId);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found with ID: " + productId);
            }

            CartResponseDTO cartDTO = userService.getCartByUserId(userId);
            cartService.addProduct(cartDTO.getCartId(), productId);
            return ResponseEntity.ok(userService.getCartByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error adding product to cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/user/{userId}/products/{productId}")
    @Operation(summary = "Remove a product from the user's cart")
    public ResponseEntity<?> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        // Validate productId is not null
        if (productId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Product ID cannot be null or undefined");
        }
        
        try {
            // Attempt to find the product
            Product product = productService.getEntityById(productId);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found with ID: " + productId);
            }

            CartResponseDTO cartDTO = userService.getCartByUserId(userId);
            cartService.removeProduct(cartDTO.getCartId(), productId);
            return ResponseEntity.ok(userService.getCartByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error removing product from cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/user/{userId}/clear")
    @Operation(summary = "Clear the user's cart")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.clearCart(cartDTO.getCartId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/user/{userId}/checkout")
    @Operation(summary = "Checkout the user's cart")
    public ResponseEntity<String> checkout(@PathVariable Long userId, @RequestBody Map<String, Object> checkoutData) {
        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.checkoutCart(cartDTO.getCartId(), checkoutData);
        return ResponseEntity.ok("Checkout successful");
    }

    @GetMapping("/all")
    @Operation(summary = "Get all carts")
    public ResponseEntity<List<Cart>> getAllCarts() {
        return ResponseEntity.ok(cartService.findAll());
    }

    @DeleteMapping("/{cartId}")
    @Operation(summary = "Delete a cart")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
