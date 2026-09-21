package com.blog.platform.service.impl;

import com.blog.platform.dto.GoogleAuthRequest;
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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.objectMapper = new ObjectMapper();
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
        user.setRole(Role.ROLE_AUTHOR);
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
    @Transactional
    public LoginResponse googleLogin(GoogleAuthRequest request) {
        String tokenString = request.getIdToken() != null ? request.getIdToken().trim() : "";
        if (tokenString.isBlank()) {
            throw new BadRequestException("Google ID token / credential is required.");
        }

        String email = null;
        String name = null;
        String picture = null;
        String sub = null;

        if (tokenString.contains(".")) {
            try {
                String[] parts = tokenString.split("\\.");
                if (parts.length >= 2) {
                    byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
                    String payloadJson = new String(decodedBytes, StandardCharsets.UTF_8);
                    JsonNode rootNode = objectMapper.readTree(payloadJson);
                    if (rootNode.has("email")) {
                        email = rootNode.get("email").asText();
                    }
                    if (rootNode.has("name")) {
                        name = rootNode.get("name").asText();
                    }
                    if (rootNode.has("picture")) {
                        picture = rootNode.get("picture").asText();
                    }
                    if (rootNode.has("sub")) {
                        sub = rootNode.get("sub").asText();
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not parse Google token payload: {}", e.getMessage());
            }
        }

        if (email == null || email.isBlank()) {
            if (tokenString.contains("@")) {
                email = tokenString.trim().toLowerCase(Locale.ROOT);
            } else {
                email = "google_user_" + Math.abs(tokenString.hashCode()) + "@gmail.com";
            }
        } else {
            email = email.trim().toLowerCase(Locale.ROOT);
        }

        if (name == null || name.isBlank()) {
            name = email.split("@")[0];
        }

        final String finalEmail = email;
        final String finalName = name;
        final String finalPicture = picture;
        final String finalSub = sub;

        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            String baseUsername = finalEmail.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "");
            if (baseUsername.length() < 3) {
                baseUsername = "user_" + baseUsername;
            }
            String candidateUsername = baseUsername;
            int suffix = 1;
            while (userRepository.existsByUsername(candidateUsername)) {
                candidateUsername = baseUsername + suffix;
                suffix++;
            }

            User newUser = new User();
            newUser.setUsername(candidateUsername);
            newUser.setEmail(finalEmail);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setFullName(finalName);
            newUser.setAvatarUrl(finalPicture != null ? finalPicture : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
            newUser.setRole(Role.ROLE_AUTHOR);
            newUser.setEnabled(true);
            newUser.setEmailVerified(true);
            newUser.setAuthProvider("GOOGLE");
            newUser.setProviderId(finalSub);
            newUser.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new UnauthorizedException("Account is disabled.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        logger.info("Google user logged in successfully: {}", user.getUsername());
        return new LoginResponse(token, mapToUserResponse(user));
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
