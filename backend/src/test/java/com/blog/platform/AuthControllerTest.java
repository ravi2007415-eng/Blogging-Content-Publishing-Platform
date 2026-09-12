package com.blog.platform;

import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    @Test
    void testCorsPreflightOnLogin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    void testCorsPreflightOnMe() throws Exception {
        mockMvc.perform(options("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    void testLoginSuccessWithCorsHeaders() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@blogplatform.com", "password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("admin"))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        LoginResponse response = objectMapper.readValue(responseJson, LoginResponse.class);
        assertNotNull(response.getToken());

        // Test /api/v1/auth/me with the acquired JWT token
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + response.getToken()))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.email").value("admin@blogplatform.com"));
    }

    @Test
    void testAuthorLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("author@blogplatform.com", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(jsonPath("$.user.username").value("tech_guru"));
    }

    @Test
    void testGetMeWithoutTokenReturnsUnauthorizedWithCorsHeaders() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    void testSendOtpInvalidGmailDomain() throws Exception {
        com.blog.platform.dto.SendOtpRequest request = new com.blog.platform.dto.SendOtpRequest("test@yahoo.com");

        mockMvc.perform(post("/api/v1/auth/send-otp")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Please enter a valid Gmail address."));
    }

    @Autowired
    private com.blog.platform.repository.UserRepository userRepository;

    @Test
    void testSendOtpAlreadyRegisteredEmail() throws Exception {
        String testEmail = "existinguser@gmail.com";
        if (!userRepository.existsByEmail(testEmail)) {
            com.blog.platform.model.entity.User user = new com.blog.platform.model.entity.User();
            user.setUsername("existinguser");
            user.setEmail(testEmail);
            user.setPassword("password123");
            user.setFullName("Existing User");
            user.setRole(com.blog.platform.model.enums.Role.ROLE_USER);
            user.setEnabled(true);
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        com.blog.platform.dto.SendOtpRequest request = new com.blog.platform.dto.SendOtpRequest(testEmail);

        mockMvc.perform(post("/api/v1/auth/send-otp")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email is already registered."));
    }

    @Test
    void testVerifyOtpNonExistent() throws Exception {
        com.blog.platform.dto.VerifyOtpRequest request = new com.blog.platform.dto.VerifyOtpRequest("newuser999@gmail.com", "123456");

        mockMvc.perform(post("/api/v1/auth/verify-otp")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Please request a new OTP."));
    }

    @Test
    void testUnverifiedUserLoginRejected() throws Exception {
        String testEmail = "unverifieduser@gmail.com";
        if (!userRepository.existsByEmail(testEmail)) {
            org.springframework.security.crypto.password.PasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
            com.blog.platform.model.entity.User user = new com.blog.platform.model.entity.User();
            user.setUsername("unverifieduser");
            user.setEmail(testEmail);
            user.setPassword(encoder.encode("password123"));
            user.setFullName("Unverified User");
            user.setRole(com.blog.platform.model.enums.Role.ROLE_USER);
            user.setEnabled(true);
            user.setEmailVerified(false);
            userRepository.save(user);
        }

        LoginRequest loginRequest = new LoginRequest(testEmail, "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Please verify your email before logging in."));
    }
}
