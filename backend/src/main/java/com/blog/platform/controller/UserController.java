package com.blog.platform.controller;

import com.blog.platform.dto.UserResponse;
import com.blog.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String, String> payload, Authentication authentication) {
        String fullName = payload.get("fullName");
        String bio = payload.get("bio");
        String avatarUrl = payload.get("avatarUrl");
        return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), fullName, bio, avatarUrl));
    }
}
