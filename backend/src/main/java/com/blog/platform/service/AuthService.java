package com.blog.platform.service;

import com.blog.platform.dto.GoogleLoginRequest;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.UserResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse loginWithGoogle(GoogleLoginRequest request);
    UserResponse register(RegisterRequest request);
    UserResponse getCurrentUser(String username);
}
