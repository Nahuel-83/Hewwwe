package Hewwwe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryCreateDTO{
        @NotBlank(message = "Name is required")
        String name;
        @NotBlank(message = "Description is required")
        String description;
}
