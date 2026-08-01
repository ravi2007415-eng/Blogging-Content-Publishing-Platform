package com.blog.platform.service;

import com.blog.platform.dto.UserResponse;
import com.blog.platform.model.enums.Role;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getPlatformStats();
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(Long userId, Role role);
    void deleteUser(Long userId);
    void deleteBlog(Long blogId);
}
