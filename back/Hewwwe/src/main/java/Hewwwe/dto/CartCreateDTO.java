package Hewwwe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

public class CartCreateDTO{
        @NotNull(message = "Cart date is required")
        Date cartDate;
        @NotBlank(message = "Status is required")
        String status;
        @NotNull(message = "User ID is required")
        Long userId;
        List<Long> productIds;
}
