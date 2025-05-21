package Hewwwe.services;

import Hewwwe.dto.AddressResponseDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    User update(Long id, User user);
    CartResponseDTO getCartByUserId(Long userId);
    List<AddressResponseDTO> getAddressesByUserId(Long userId);
    List<ProductResponseDTO> getProductsByUserId(Long userId);
    List<ExchangeResponseDTO> getExchangesByUserId(Long userId);
    void delete(Long id);
}
