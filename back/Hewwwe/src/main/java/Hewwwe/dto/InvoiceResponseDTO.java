package Hewwwe.dto;

import Hewwwe.entity.enums.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceResponseDTO{
        Long invoiceId;
        Date invoiceDate;
        Double totalAmount;
        InvoiceStatus status;
        Long userId;
        String userName;
        Long addressId;
        List<Long> productIds;
        String pdfUrl;
}
