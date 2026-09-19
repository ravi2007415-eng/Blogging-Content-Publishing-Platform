package com.blog.platform.service.impl;

import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.exception.BadRequestException;
import com.blog.platform.exception.DuplicateResourceException;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.exception.UnauthorizedException;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.service.AuthService;
import com.blog.platform.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateEmailAddress(email);

        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        if (username.length() < 3) {
            throw new BadRequestException("Username must be at least 3 characters.");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username is already taken.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("This email is already registered. Please log in.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null && !request.getFullName().isBlank() ? request.getFullName().trim() : username);
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank() 
                ? request.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setAuthProvider("LOCAL");
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        logger.info("Successfully registered user: {} with email: {}", username, email);

        return mapToUserResponse(saved);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String usernameOrEmail = request.getUsernameOrEmail() != null ? request.getUsernameOrEmail().trim() : "";
        if (usernameOrEmail.isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Please enter your username/email and password.");
        }

        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail.toLowerCase(Locale.ROOT))
                        .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password.")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username/email or password.");
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new UnauthorizedException("Account is disabled.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        UserResponse userResp = mapToUserResponse(user);
        logger.info("User logged in successfully: {}", user.getUsername());
        return new LoginResponse(token, userResp);
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return mapToUserResponse(user);
    }

    private void validateEmailAddress(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new BadRequestException("Please enter a valid email address.");
        }
    }

    private String normalizeEmail(String email) {
        return email != null ? email.trim().toLowerCase(Locale.ROOT) : "";
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getEnabled(),
                user.getEmailVerified(),
                user.getCreatedAt()
        );
    }
}
