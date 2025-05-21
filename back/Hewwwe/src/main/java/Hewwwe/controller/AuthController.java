/**
 * Package containing the application's controllers
 */
package Hewwwe.controller;

import Hewwwe.dto.LoginRequest;
import Hewwwe.dto.LoginResponse;
import Hewwwe.entity.User;
import java.util.Map;
import Hewwwe.dto.RegisterRequest;
import jakarta.validation.Valid;
import Hewwwe.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Controller that handles authentication operations
 * Provides endpoints for user login and registration
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    /**
     * Spring Security authentication manager
     */
    private final AuthenticationManager authenticationManager;
    
    /**
     * Service containing business logic for authentication
     */
    private final AuthService authService;

    /**
     * Endpoint for user login
     * 
     * @param login Object with user credentials
     * @return ResponseEntity with session data
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest login) {
        // Authenticate the user with provided credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getNameOrEmail(), login.getPassword()));

        // Set the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok(authService.login(authentication));
    }

    /**
     * Endpoint for registering a new user
     * 
     * @param request Object with new user data
     * @return ResponseEntity with registration result
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        try {
            // Attempt to register the new user
            User user = authService.register(request);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Registration successful",
                    "user", user));
        } catch (Exception e) {
            // Handle errors during registration
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }
}
