package Hewwwe.controller;

import Hewwwe.dto.CategoryCreateDTO;
import Hewwwe.dto.CategoryResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Category;
import Hewwwe.entity.Product;
import Hewwwe.services.CategoryService;
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
 * Controlador REST que maneja las operaciones relacionadas con las categorías.
 * Gestiona la creación, actualización y consulta de categorías de productos.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category Controller", description = "Category management endpoints")
public class CategoryController {

    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    /**
     * Obtiene todas las categorías registradas en el sistema.
     *
     * @return ResponseEntity con la lista de categorías
     */
    @GetMapping
    @Operation(summary = "Get all categories")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categories = categoryService.getAllCategories().stream()
                .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                .toList();
        return ResponseEntity.ok(categories);
    }

    /**
     * Obtiene una categoría por su ID.
     *
     * @param id ID de la categoría
     * @return ResponseEntity con la categoría encontrada
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved category")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(modelMapper.map(category, CategoryResponseDTO.class));
    }

    /**
     * Crea una nueva categoría.
     *
     * @param categoryDTO DTO con los datos de la categoría a crear
     * @return ResponseEntity con la categoría creada
     */
    @PostMapping
    @Operation(summary = "Create a new category")
    @ApiResponse(responseCode = "201", description = "Category created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CategoryCreateDTO> createCategory(@Valid @RequestBody CategoryCreateDTO categoryDTO) {
        try {
            Category category = modelMapper.map(categoryDTO, Category.class);
            Category savedCategory = categoryService.createCategory(category);
            return new ResponseEntity<>(modelMapper.map(savedCategory, CategoryCreateDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating category: " + e.getMessage());
        }
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param id ID de la categoría a actualizar
     * @param categoryDTO DTO con los datos actualizados de la categoría
     * @return ResponseEntity con la categoría actualizada
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category")
    @ApiResponse(responseCode = "200", description = "Category updated successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryCreateDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryCreateDTO categoryDTO) {
        try {
            Category category = modelMapper.map(categoryDTO, Category.class);
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(modelMapper.map(updatedCategory, CategoryCreateDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating category: " + e.getMessage());
        }
    }

    /**
     * Elimina una categoría.
     *
     * @param id ID de la categoría a eliminar
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category")
    @ApiResponse(responseCode = "204", description = "Category deleted successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene todos los productos de una categoría.
     *
     * @param id ID de la categoría
     * @return ResponseEntity con la lista de productos de la categoría
     */
    @GetMapping("/{id}/products")
    @Operation(summary = "Get all products in a category")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved category products")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long id) {
        List<Product> products = categoryService.getProductsByCategory(id);
        return ResponseEntity.ok(products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .toList());
    }
}
