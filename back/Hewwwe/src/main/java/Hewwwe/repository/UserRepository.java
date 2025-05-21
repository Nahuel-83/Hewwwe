package Hewwwe.repository;

import Hewwwe.entity.User;
import Hewwwe.entity.enums.Rol;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByRole(Rol role);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Nuevos métodos
    List<User> findByIsActiveTrue();

    Optional<User> findByUserIdAndIsActiveTrue(Long userId);

    List<User> findByRoleAndIsActiveTrue(Rol role);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.cart WHERE u.id = :userId")
    Optional<User> findByIdWithCart(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.id = :userId")
    Optional<User> findByIdWithAddresses(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.products WHERE u.id = :userId")
    Optional<User> findByIdWithProducts(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.invoices WHERE u.id = :userId")
    Optional<User> findByIdWithInvoices(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.requestedExchanges LEFT JOIN FETCH u.ownedExchanges WHERE u.id = :userId")
    Optional<User> findByIdWithExchanges(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses LEFT JOIN FETCH u.products WHERE u.userId = :userId")
    Optional<User> findByIdWithAddressesAndProducts(@Param("userId") Long userId);

    Optional<User> findByUsernameOrEmail(String username, String email);
}