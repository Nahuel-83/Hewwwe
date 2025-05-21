package Hewwwe.services;

import org.springframework.security.core.Authentication;


import Hewwwe.dto.LoginResponse;
import Hewwwe.dto.RegisterRequest;
import Hewwwe.entity.User;

public interface AuthService {
    LoginResponse login(Authentication authentication);
    User getCurrentUser(Authentication authentication);
    User register(RegisterRequest request);
}
