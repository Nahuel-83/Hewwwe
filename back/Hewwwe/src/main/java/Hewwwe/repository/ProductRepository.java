package Hewwwe.repository;

import Hewwwe.entity.Category;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
    List<Product> findByCategory(Category category);
    List<Product> findByStatus(String status);
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
