package Hewwwe.services;

import Hewwwe.entity.Category;
import Hewwwe.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Category createCategory(Category category);
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category updateCategory(Long id, Category categoryDetails);
    void deleteCategory(Long id);
    List<Product> getProductsByCategory(Long categoryId);
}
