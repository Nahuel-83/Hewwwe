package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDTO {
    Long addressId;
    String street;
    String number;
    String city;
    String country;
    String postalCode;
    Long userId;
    String userName;
}
