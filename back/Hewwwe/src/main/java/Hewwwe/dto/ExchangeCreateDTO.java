package Hewwwe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeCreateDTO{

        @NotBlank(message = "Status is required")
        String status;

        @NotNull(message = "Exchange date is required")
        Date exchangeDate;

        Date completionDate;

        @NotNull(message = "Requester ID is required")
        Long requesterId;

        @NotNull(message = "Owner ID is required")
        Long ownerId;

        @NotNull(message = "Product IDs are required")
        List<Long> productIds;
}
