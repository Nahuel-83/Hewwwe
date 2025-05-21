package Hewwwe.dto;

import Hewwwe.entity.User;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private User data;
    private String message;
}
