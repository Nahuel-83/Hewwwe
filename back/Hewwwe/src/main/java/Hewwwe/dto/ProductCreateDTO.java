package Hewwwe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreateDTO {
        @NotBlank(message = "Name is required")
        String name;

        @NotBlank(message = "Description is required")
        String description;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Double price;

        @NotBlank(message = "Image is required")
        String image;

        @NotBlank(message = "Size is required")
        String size;

        @NotBlank(message = "Status is required")
        String status;

        @NotNull(message = "Publication date is required")
        Date publicationDate;

        @NotNull(message = "User ID is required")
        Long userId;

        @NotNull(message = "Category ID is required")
        Long categoryId;

        Long cartId;
        Long exchangeId;
}
