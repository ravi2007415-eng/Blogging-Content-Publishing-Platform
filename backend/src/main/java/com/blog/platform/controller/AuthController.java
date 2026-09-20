package com.blog.platform.controller;

import com.blog.platform.dto.GoogleAuthRequest;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(
    origins = {
        "https://considerate-strength-production-8972.up.railway.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    },
    originPatterns = {
        "https://*.up.railway.app",
        "*"
    },
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.PATCH,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS,
        RequestMethod.HEAD
    },
    allowCredentials = "true",
    maxAge = 3600
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }
}
