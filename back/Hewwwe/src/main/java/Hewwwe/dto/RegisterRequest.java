package Hewwwe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String phone;

    @NotNull
    private AddressDTO address;

    @Data
    public static class AddressDTO {
        @NotBlank
        private String street;

        @NotBlank
        private String number;

        @NotBlank
        private String city;

        @NotBlank
        private String country;

        @NotBlank
        private String postalCode;
    }
}
