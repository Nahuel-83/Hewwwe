package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeResponseDTO {
    private Long exchangeId;
    private Date exchangeDate;
    private Date completionDate;
    private String status;
    private Long requesterId;
    private String requesterName;
    private Long ownerId;
    private String ownerName;
    private List<ProductResponseDTO> products;
}
