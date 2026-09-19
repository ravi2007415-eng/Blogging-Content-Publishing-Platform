package com.blog.platform;

import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationFullFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @MockBean
    private JavaMailSender mailSender;

    @Test
    @DisplayName("TEST 1: Direct registration -> save to DB -> login -> /auth/me returns profile")
    void test1_DirectRegistrationAndLoginFullFlow() throws Exception {
        String uniqueEmail = "newuser_" + System.currentTimeMillis() + "@example.com";
        String uniqueUsername = "user_" + System.currentTimeMillis();

        // 1. Direct Registration (No OTP, no email verification)
        RegisterRequest registerRequest = new RegisterRequest(uniqueUsername, uniqueEmail, "SecurePassword123!", "Test New User");
        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.username").value(uniqueUsername))
                .andExpect(jsonPath("$.fullName").value("Test New User"))
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.emailVerified").value(true));

        // 2. Verify user was saved directly in database
        User savedUser = userRepository.findByEmail(uniqueEmail).orElseThrow();
        assertTrue(savedUser.getEnabled(), "User must be enabled immediately");
        assertTrue(savedUser.getEmailVerified(), "Email must be verified immediately");
        assertTrue(passwordEncoder.matches("SecurePassword123!", savedUser.getPassword()), "Password must be BCrypt encoded");

        // 3. Login with email and password
        LoginRequest loginRequest = new LoginRequest(uniqueEmail, "SecurePassword123!");
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value(uniqueUsername))
                .andReturn();

        LoginResponse loginResponse = objectMapper.readValue(loginResult.getResponse().getContentAsString(), LoginResponse.class);
        assertNotNull(loginResponse.getToken());

        // 4. Also test login with username
        LoginRequest loginByUsername = new LoginRequest(uniqueUsername, "SecurePassword123!");
        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginByUsername)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value(uniqueUsername));

        // 5. /auth/me returns 200 with user profile
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + loginResponse.getToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(uniqueUsername))
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.fullName").value("Test New User"));
    }

    @Test
    @DisplayName("TEST 2: Duplicate email or username registration rejected with 409 Conflict")
    void test2_DuplicateRegistrationRejected() throws Exception {
        String existingEmail = "author@blogplatform.com";
        RegisterRequest emailDupe = new RegisterRequest("brandnew_" + System.currentTimeMillis(), existingEmail, "password123", "Dupe");
        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailDupe)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("This email is already registered. Please log in."));

        RegisterRequest userDupe = new RegisterRequest("admin", "newemail_" + System.currentTimeMillis() + "@test.com", "password123", "Dupe");
        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDupe)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Username is already taken."));
    }

    @Test
    @DisplayName("TEST 3: Existing seeded users can login cleanly")
    void test3_ExistingSeedUserLogin() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@blogplatform.com", "password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("admin"))
                .andReturn();

        LoginResponse resp = objectMapper.readValue(result.getResponse().getContentAsString(), LoginResponse.class);

        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resp.getToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.email").value("admin@blogplatform.com"));
    }

    @Test
    @DisplayName("TEST 4: Unauthenticated request without token returns 401")
    void test4_UnauthenticatedWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TEST 5: Invalid credentials returns proper 401 error message")
    void test5_InvalidCredentialsReturns401() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@blogplatform.com", "WRONG_PASSWORD_XYZ");

        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username/email or password."));
    }

    @Test
    @DisplayName("TEST 6: Expired or invalid token returns 401 on /auth/me")
    void test6_InvalidTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.jwt.token.here"))
                .andExpect(status().isUnauthorized());
    }
}
