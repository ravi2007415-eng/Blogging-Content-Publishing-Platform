package com.blog.platform.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Value("${app.cors.allowed-origins:https://considerate-strength-production-8972.up.railway.app,http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        String origin = request.getHeader("Origin");
        if (origin != null) {
            List<String> origins = new ArrayList<>(
                Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList()
            );
            if (!origins.contains("https://considerate-strength-production-8972.up.railway.app")) {
                origins.add("https://considerate-strength-production-8972.up.railway.app");
            }
            if (!origins.contains("http://localhost:5173")) {
                origins.add("http://localhost:5173");
            }
            if (!origins.contains("http://127.0.0.1:5173")) {
                origins.add("http://127.0.0.1:5173");
            }

            if (origins.contains(origin) || origin.endsWith(".up.railway.app") || origin.contains("localhost") || origin.contains("127.0.0.1")) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Access-Control-Allow-Credentials", "true");
                response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
                response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
                response.setHeader("Access-Control-Expose-Headers", "Authorization, Content-Disposition, Link, X-Total-Count");
            }
        }
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + (authException != null ? authException.getMessage() : "Unauthorized access") + "\"}");
    }
}
