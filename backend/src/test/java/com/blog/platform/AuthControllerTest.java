package com.blog.platform;

import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.repository.UserRepository;
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

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private JavaMailSender mailSender;

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
    void testCorsPreflightOnRegisterProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    void testCorsPreflightOnGoogleAuthProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/google")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    void testCorsPreflightOnMe() throws Exception {
        mockMvc.perform(options("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    void testLoginSuccessWithCorsHeaders() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@blogplatform.com", "password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("admin"))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        LoginResponse response = objectMapper.readValue(responseJson, LoginResponse.class);
        assertNotNull(response.getToken());

        // Test /api/v1/auth/me with the acquired JWT token and production origin
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + response.getToken()))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.email").value("admin@blogplatform.com"));
    }

    @Test
    void testAuthorLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("author@blogplatform.com", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(jsonPath("$.user.username").value("tech_guru"));
    }

    @Test
    void testGetMeWithoutTokenReturnsUnauthorizedWithCorsHeaders() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    void testDirectRegistrationSuccessWithProductionCors() throws Exception {
        String uniqueUser = "newuser_" + System.currentTimeMillis();
        String uniqueEmail = uniqueUser + "@example.com";
        RegisterRequest registerRequest = new RegisterRequest(uniqueUser, uniqueEmail, "password123", "New Test User");

        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.username").value(uniqueUser))
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.fullName").value("New Test User"))
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.emailVerified").value(true));

        // Now test login with this newly registered user
        LoginRequest loginRequest = new LoginRequest(uniqueEmail, "password123");
        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value(uniqueUser));
    }

    @Test
    void testGoogleAuthSuccessWithProductionCors() throws Exception {
        com.blog.platform.dto.GoogleAuthRequest googleAuth = new com.blog.platform.dto.GoogleAuthRequest("mock_google_token_" + System.currentTimeMillis() + "@gmail.com");

        mockMvc.perform(post("/api/v1/auth/google")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(googleAuth)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").isNotEmpty());
    }

    @Test
    void testRegisterDuplicateUsername() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("admin", "brandnewunique@example.com", "password123", "Admin Dupe");

        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(jsonPath("$.message").value("Username is already taken."));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("uniqueuser_" + System.currentTimeMillis(), "admin@blogplatform.com", "password123", "Admin Email Dupe");

        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(jsonPath("$.message").value("This email is already registered. Please log in."));
    }

    @Test
    void testInvalidCredentialsReturns401() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@blogplatform.com", "wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "https://considerate-strength-production-8972.up.railway.app")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://considerate-strength-production-8972.up.railway.app"))
                .andExpect(jsonPath("$.message").value("Invalid username/email or password."));
    }
}
