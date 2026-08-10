package com.blog.platform.service.impl;

import com.blog.platform.dto.GoogleLoginRequest;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.exception.DuplicateResourceException;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.exception.UnauthorizedException;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.service.AuthService;
import com.blog.platform.util.JwtUtil;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new UnauthorizedException("Invalid username or password")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        if (!user.getEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        UserResponse userResp = mapToUserResponse(user);
        return new LoginResponse(token, userResp);
    }

    @Override
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        String token = request.getToken();
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Google authentication token is missing");
        }

        Map<String, Object> googleUser = verifyGoogleToken(token);
        String email = (String) googleUser.get("email");
        if (email == null || email.isBlank()) {
            throw new UnauthorizedException("Unable to retrieve email from Google account");
        }

        String name = (String) googleUser.getOrDefault("name", email.split("@")[0]);
        String picture = (String) googleUser.getOrDefault("picture", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "_").toLowerCase();
            String username = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + counter++;
            }
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setFullName(name);
            newUser.setAvatarUrl(picture);
            newUser.setRole(Role.ROLE_USER);
            newUser.setEnabled(true);
            return userRepository.save(newUser);
        });

        if (!user.getEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String jwtToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new LoginResponse(jwtToken, mapToUserResponse(user));
    }

    private Map<String, Object> verifyGoogleToken(String token) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            // 1. Try Google ID Token verification
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().containsKey("email")) {
                return response.getBody();
            }
        } catch (Exception e) {
            // 2. Fallback: Try UserInfo endpoint with Access Token
            try {
                String userinfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(token);
                HttpEntity<Void> entity = new HttpEntity<>(headers);
                ResponseEntity<Map> userinfoResponse = restTemplate.exchange(userinfoUrl, HttpMethod.GET, entity, Map.class);
                if (userinfoResponse.getStatusCode().is2xxSuccessful() && userinfoResponse.getBody() != null && userinfoResponse.getBody().containsKey("email")) {
                    return userinfoResponse.getBody();
                }
            } catch (Exception ex) {
                throw new UnauthorizedException("Invalid or expired Google authentication token");
            }
        }
        throw new UnauthorizedException("Invalid or expired Google authentication token");
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank() 
                ? request.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);

        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username)));
        return mapToUserResponse(user);
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
                user.getCreatedAt()
        );
    }
}
