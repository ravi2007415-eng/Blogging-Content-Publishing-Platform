package com.blog.platform.service;

import com.blog.platform.dto.UserResponse;
import com.blog.platform.model.enums.Role;
import java.util.List;

public interface UserService {
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);
    List<UserResponse> getAllUsers();
    UserResponse updateUserProfile(String username, String fullName, String bio, String avatarUrl);
    UserResponse updateUserRole(Long userId, Role role);
    void deleteUser(Long userId);
}
