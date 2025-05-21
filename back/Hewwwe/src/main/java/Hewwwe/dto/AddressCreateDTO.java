package Hewwwe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressCreateDTO{
        @NotBlank(message = "Street is required")
        String street;

        @NotBlank(message = "Number is required")
        String number;

        @NotBlank(message = "City is required")
        String city;

        @NotBlank(message = "Country is required")
        String country;

        @NotBlank(message = "Postal code is required")
        String postalCode;
}
