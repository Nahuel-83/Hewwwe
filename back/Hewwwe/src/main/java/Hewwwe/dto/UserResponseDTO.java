package Hewwwe.dto;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Date registrationDate;
    private String username;
}