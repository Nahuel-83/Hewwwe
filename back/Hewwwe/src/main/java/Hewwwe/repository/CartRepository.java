package Hewwwe.repository;

import Hewwwe.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Cart entity operations.
 * Provides CRUD operations for shopping carts in the system.
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
}
