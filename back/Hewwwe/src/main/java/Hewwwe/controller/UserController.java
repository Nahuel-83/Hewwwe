package Hewwwe.controller;

import Hewwwe.dto.AddressResponseDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserCreateDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.dto.UserUpdateDTO;
import Hewwwe.entity.*;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller that handles user-related operations.
 * Provides endpoints for user management including CRUD and related operations.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "User management endpoints")
public class UserController {
    private final UserService userService;
    private final ModelMapper modelMapper;

    /**
     * Registers a new user in the system.
     *
     * @param userDTO Data of the new user
     * @return ResponseEntity containing the created user
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User savedUser = userService.save(user);
        return new ResponseEntity<>(modelMapper.map(savedUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    /**
     * Updates an existing user's information.
     *
     * @param id ID of the user to update
     * @param userDTO New user data
     * @return ResponseEntity containing the updated user
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update user")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(modelMapper.map(updatedUser, UserResponseDTO.class));
    }

    /**
     * Retrieves all registered users in the system.
     *
     * @return ResponseEntity with the list of users
     */
    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Obtains a user by their ID.
     *
     * @param id ID of the user
     * @return ResponseEntity with the user's details
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id ID of the user to delete
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtains the shopping cart of a user.
     *
     * @param id ID of the user
     * @return ResponseEntity with the cart details
     */
    @GetMapping("/{id}/cart")
    @Operation(summary = "Get user's cart")
    public ResponseEntity<CartResponseDTO> getUserCart(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCartByUserId(id));
    }

    /**
     * Obtains the addresses of a user.
     *
     * @param id ID of the user
     * @return ResponseEntity with the list of addresses
     */
    @GetMapping("/{id}/addresses")
    @Operation(summary = "Get user's addresses")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getAddressesByUserId(id));
    }

    /**
     * Obtains the products of a user.
     *
     * @param id ID of the user
     * @return ResponseEntity with the list of products
     */
    @GetMapping("/{id}/products")
    @Operation(summary = "Get user's products")
    public ResponseEntity<List<ProductResponseDTO>> getUserProducts(@PathVariable Long id) {
        try {
            List<ProductResponseDTO> products = userService.getProductsByUserId(id);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtains the exchanges of a user (requested and owned).
     *
     * @param id ID of the user
     * @return ResponseEntity with the list of exchanges
     */
    @GetMapping("/{id}/exchanges")
    @Operation(summary = "Get user's exchanges (requested + owned)")
    public ResponseEntity<List<ExchangeResponseDTO>> getUserExchanges(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getExchangesByUserId(id));
    }
}
