package Hewwwe.services;

import Hewwwe.dto.AddressResponseDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.entity.enums.Rol;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findByIdWithAddressesAndProducts(id);
    }

    @Override
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRegistrationDate(new Date());
        return userRepository.save(user);
    }

    @Override
    public User update(Long id, User user) {
        return userRepository.findById(id)
            .map(existingUser -> {
                existingUser.setName(user.getName());
                existingUser.setEmail(user.getEmail());
                existingUser.setPhone(user.getPhone());
                existingUser.setUsername(user.getUsername());
                existingUser.setRole(Rol.USER);
                
                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
                }
                
                return userRepository.save(existingUser);
            }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public CartResponseDTO getCartByUserId(Long userId) {
        System.out.println("UserService: Getting cart for user ID: " + userId);
        return userRepository.findById(userId).map(user -> {
            System.out.println("UserService: User found: " + user.getName());
            Cart cart = user.getCart();
            if (cart == null) {
                System.out.println("UserService: No cart found for user, creating a new one");
                cart = new Cart();
                cart.setCartDate(new Date());
                cart.setUser(user);
                cart.setProducts(new ArrayList<>());
                user.setCart(cart);
                userRepository.save(user);
                System.out.println("UserService: Created new cart with ID: " + cart.getCartId());
            }

            System.out.println("UserService: Cart found with ID: " + cart.getCartId());
            System.out.println("UserService: Products in cart: " + (cart.getProducts() != null ? cart.getProducts().size() : "null"));
            
            List<Long> productIds = new ArrayList<>();
            if (cart.getProducts() != null && !cart.getProducts().isEmpty()) {
                productIds = cart.getProducts().stream()
                        .map(Product::getProductId)
                        .collect(Collectors.toList());
                System.out.println("UserService: Product IDs collected: " + productIds);
            } else {
                System.out.println("UserService: No products in cart");
            }

            CartResponseDTO response = new CartResponseDTO(
                    cart.getCartId(),
                    cart.getCartDate(),
                    user.getUserId(),
                    productIds
            );
            System.out.println("UserService: Returning cart response with " + productIds.size() + " products");
            return response;
        }).orElseGet(() -> {
            System.out.println("UserService: User not found with ID: " + userId);
            return null;
        });
    }


    public List<AddressResponseDTO> getAddressesByUserId(Long userId) {
        return userRepository.findById(userId).map(user ->
                user.getAddresses().stream().map(address ->
                        new AddressResponseDTO(
                                address.getAddressId(),
                                address.getStreet(),
                                address.getNumber(),
                                address.getCity(),
                                address.getCountry(),
                                address.getPostalCode(),
                                user.getUserId(),
                                user.getName()
                        )
                ).collect(Collectors.toList())
        ).orElse(List.of());
    }


    public List<ProductResponseDTO> getProductsByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getProducts().stream().map(product -> {
                    ProductResponseDTO dto = new ProductResponseDTO();
                    dto.setProductId(product.getProductId());
                    dto.setName(product.getName());
                    dto.setDescription(product.getDescription());
                    dto.setPrice(product.getPrice());
                    dto.setImage(product.getImage());
                    dto.setSize(product.getSize());
                    dto.setStatus(product.getStatus());
                    dto.setPublicationDate(product.getPublicationDate());

                    // Cargar IDs de relaciones sin devolver entidades
                    dto.setUserId(product.getUser().getUserId());
                    dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
                    dto.setCartId(product.getCart() != null ? product.getCart().getCartId() : null);
                    
                    // Si el producto está en algún intercambio, tomar el ID del primero
                    dto.setExchangeId(product.getExchanges() != null && !product.getExchanges().isEmpty() 
                        ? product.getExchanges().get(0).getExchangeId() 
                        : null);

                    return dto;
                }).collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }


    public List<ExchangeResponseDTO> getExchangesByUserId(Long userId) {
        return userRepository.findById(userId).map(user -> {
            List<Exchange> allExchanges = new ArrayList<>();
            allExchanges.addAll(user.getRequestedExchanges());
            allExchanges.addAll(user.getOwnedExchanges());
    
            return allExchanges.stream().map(exchange -> {
                ExchangeResponseDTO dto = new ExchangeResponseDTO();
                dto.setExchangeId(exchange.getExchangeId());
                dto.setExchangeDate(exchange.getExchangeDate());
                dto.setCompletionDate(exchange.getCompletionDate());
                dto.setStatus(exchange.getStatus());
    
                // Usuarios
                if (exchange.getRequester() != null) {
                    dto.setRequesterId(exchange.getRequester().getUserId());
                    dto.setRequesterName(exchange.getRequester().getName()); 
                }
                if (exchange.getOwner() != null) {
                    dto.setOwnerId(exchange.getOwner().getUserId());
                    dto.setOwnerName(exchange.getOwner().getName()); 
                }
    
                // Productos
                List<ProductResponseDTO> productDTOs = new ArrayList<>();
                for (Product p : exchange.getProducts()) {
                    ProductResponseDTO productDTO = new ProductResponseDTO();
                    productDTO.setProductId(p.getProductId());
                    productDTO.setName(p.getName());
                    productDTO.setDescription(p.getDescription());
                    productDTO.setPrice(p.getPrice());
                    productDTO.setImage(p.getImage());
                    productDTO.setSize(p.getSize());
                    productDTO.setStatus(p.getStatus());
                    productDTO.setPublicationDate(p.getPublicationDate());
                    productDTO.setUserId(p.getUser().getUserId());
                    
                    productDTOs.add(productDTO);
                }
                dto.setProducts(productDTOs);
    
                return dto;
            }).collect(Collectors.toList());
        }).orElse(List.of());
    }


    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
