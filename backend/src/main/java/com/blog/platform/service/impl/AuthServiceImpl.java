package com.blog.platform.service.impl;

import com.blog.platform.dto.GoogleAuthRequest;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.SendOtpRequest;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.dto.VerifyOtpRequest;
import com.blog.platform.exception.BadRequestException;
import com.blog.platform.exception.DuplicateResourceException;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.exception.UnauthorizedException;
import com.blog.platform.model.entity.EmailVerification;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.EmailVerificationRepository;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.service.AuthService;
import com.blog.platform.service.EmailService;
import com.blog.platform.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.google.client-id:}")
    private String configuredGoogleClientId;

    public AuthServiceImpl(
            UserRepository userRepository,
            EmailVerificationRepository emailVerificationRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void sendOtp(SendOtpRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateGmailAddress(email);

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        // Check 60-second cooldown from previous OTP request for this email
        Optional<EmailVerification> lastOpt = emailVerificationRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (lastOpt.isPresent()) {
            EmailVerification last = lastOpt.get();
            if (last.getLastSentAt() != null && last.getLastSentAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                long remainingSecs = Duration.between(LocalDateTime.now(), last.getLastSentAt().plusSeconds(60)).getSeconds();
                throw new BadRequestException("Please wait " + Math.max(1, remainingSecs) + " seconds before requesting a new code.");
            }
        }

        // Invalidate or remove previous OTP records for this email
        List<EmailVerification> existingList = emailVerificationRepository.findAllByEmail(email);
        if (!existingList.isEmpty()) {
            emailVerificationRepository.deleteAll(existingList);
        }

        // Generate 6-digit random OTP
        String otp = String.format(Locale.ROOT, "%06d", secureRandom.nextInt(1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        EmailVerification verification = new EmailVerification(email, otp, expiryTime);
        emailVerificationRepository.save(verification);

        // Send OTP email
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateGmailAddress(email);

        String otp = request.getOtp() != null ? request.getOtp().trim() : "";

        EmailVerification verification = emailVerificationRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("Please request a new OTP."));

        if (verification.getAttemptsCount() != null && verification.getAttemptsCount() >= 5) {
            throw new BadRequestException("Maximum verification attempts exceeded. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(verification.getExpiryTime())) {
            throw new BadRequestException("OTP expired. Please request a new OTP.");
        }

        if (!verification.getOtp().equals(otp)) {
            verification.setAttemptsCount((verification.getAttemptsCount() == null ? 0 : verification.getAttemptsCount()) + 1);
            emailVerificationRepository.save(verification);
            throw new BadRequestException("Invalid OTP.");
        }

        verification.setVerified(true);
        emailVerificationRepository.save(verification);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String usernameOrEmail = request.getUsernameOrEmail() != null ? request.getUsernameOrEmail().trim() : "";

        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail.toLowerCase(Locale.ROOT))
                        .orElseThrow(() -> new UnauthorizedException("Invalid username or password.")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password.");
        }

        if (user.getEmailVerified() != null && !user.getEmailVerified()) {
            throw new UnauthorizedException("Please verify your email before logging in.");
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new UnauthorizedException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        UserResponse userResp = mapToUserResponse(user);
        return new LoginResponse(token, userResp);
    }

    @Override
    @Transactional
    public LoginResponse loginWithGoogle(GoogleAuthRequest request) {
        String idToken = request.getIdToken();
        if (idToken == null || idToken.isBlank()) {
            idToken = request.getCredential();
        }
        if (idToken == null || idToken.isBlank()) {
            throw new BadRequestException("Google ID token is required.");
        }

        Map<String, Object> tokenInfo;
        try {
            String verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) restTemplate.getForObject(verifyUrl, Map.class);
            tokenInfo = response;
        } catch (Exception e) {
            logger.error("Error validating Google token: {}", e.getMessage());
            throw new UnauthorizedException("Google token verification failed. Please try again.");
        }

        if (tokenInfo == null || tokenInfo.containsKey("error")) {
            throw new UnauthorizedException("Invalid or expired Google authentication token.");
        }

        String email = (String) tokenInfo.get("email");
        String emailVerified = String.valueOf(tokenInfo.get("email_verified"));
        String name = (String) tokenInfo.get("name");
        String picture = (String) tokenInfo.get("picture");
        String sub = (String) tokenInfo.get("sub");
        String aud = (String) tokenInfo.get("aud");

        if (email == null || email.isBlank()) {
            throw new UnauthorizedException("Google account did not provide an email address.");
        }

        if (!"true".equalsIgnoreCase(emailVerified)) {
            throw new UnauthorizedException("Google account email is unverified.");
        }

        email = normalizeEmail(email);

        if (configuredGoogleClientId != null && !configuredGoogleClientId.isBlank() && !configuredGoogleClientId.equals(aud)) {
            logger.warn("Token audience {} did not match configured client id {}", aud, configuredGoogleClientId);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (user.getAuthProvider() == null || "LOCAL".equals(user.getAuthProvider())) {
                user.setAuthProvider("GOOGLE");
                user.setProviderId(sub);
            }
            if (!Boolean.TRUE.equals(user.getEmailVerified())) {
                user.setEmailVerified(true);
            }
            if (picture != null && (user.getAvatarUrl() == null || user.getAvatarUrl().contains("unsplash"))) {
                user.setAvatarUrl(picture);
            }
            user = userRepository.save(user);
        } else {
            user = new User();
            String baseUsername = (name != null ? name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase(Locale.ROOT) : email.split("@")[0]);
            if (baseUsername.isBlank()) baseUsername = "creator";
            String uniqueUsername = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(uniqueUsername)) {
                uniqueUsername = baseUsername + counter++;
            }

            user.setUsername(uniqueUsername);
            user.setEmail(email);
            user.setFullName(name != null && !name.isBlank() ? name : uniqueUsername);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setAvatarUrl(picture != null && !picture.isBlank() ? picture : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
            user.setRole(Role.ROLE_USER);
            user.setEnabled(true);
            user.setEmailVerified(true);
            user.setAuthProvider("GOOGLE");
            user.setProviderId(sub);
            user = userRepository.save(user);
            logger.info("Created new Google OAuth user: {}", uniqueUsername);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new LoginResponse(token, mapToUserResponse(user));
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateGmailAddress(email);

        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username is already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered");
        }

        // Verify that OTP verification took place for this Gmail address
        EmailVerification verification = emailVerificationRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("Please verify your email before registering."));

        if (!Boolean.TRUE.equals(verification.getVerified())) {
            throw new BadRequestException("Please verify your email before registering.");
        }

        if (LocalDateTime.now().isAfter(verification.getExpiryTime().plusMinutes(15))) {
            throw new BadRequestException("Verification session expired. Please request a new OTP.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : username);
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank() 
                ? request.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setAuthProvider("LOCAL");

        User saved = userRepository.save(user);

        // Clean up verification records after successful account creation
        emailVerificationRepository.delete(verification);

        return mapToUserResponse(saved);
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return mapToUserResponse(user);
    }

    private void validateGmailAddress(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")) {
            throw new BadRequestException("Please enter a valid Gmail address.");
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
