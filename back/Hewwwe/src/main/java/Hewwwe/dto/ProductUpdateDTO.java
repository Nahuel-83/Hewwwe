package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductUpdateDTO {
    private String name;
    private String description;
    private Double price;
    private String image;
    private String size;
    private String status;
    private Long categoryId;
}
