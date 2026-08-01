package com.blog.platform.config;

import org.springframework.stereotype.Component;

@Component
public class JwtFilter extends JwtAuthenticationFilter {
    public JwtFilter(com.blog.platform.util.JwtUtil jwtUtil) {
        super(jwtUtil);
    }
}
