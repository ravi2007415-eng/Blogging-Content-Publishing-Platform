package com.blog.platform.service;

import com.blog.platform.dto.GoogleAuthRequest;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.dto.SendOtpRequest;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.dto.VerifyOtpRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse loginWithGoogle(GoogleAuthRequest request);
    UserResponse register(RegisterRequest request);
    UserResponse getCurrentUser(String username);
    void sendOtp(SendOtpRequest request);
    void verifyOtp(VerifyOtpRequest request);
}

