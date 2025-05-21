package Hewwwe.dto;

import Hewwwe.entity.enums.InvoiceStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceCreateDTO{

        @NotNull(message = "Invoice date is required")
        Date invoiceDate;
        
        @NotNull(message = "Total amount is required")
        @Positive(message = "Total amount must be positive")
        Double totalAmount;
        
        @NotNull(message = "Status is required")
        InvoiceStatus status;
        
        @NotNull(message = "User ID is required")
        Long userId;
        
        @NotNull(message = "Address ID is required")
        Long addressId;
        
        @NotNull(message = "Product IDs are required")
        List<Long> productIds;
        
        String pdfUrl;
}
