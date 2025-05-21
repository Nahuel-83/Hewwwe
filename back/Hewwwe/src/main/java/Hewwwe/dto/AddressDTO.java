package Hewwwe.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private String street;
    private String number;
    private String city;
    private String country;
    private String postalCode;
}
