package com.blog.platform.controller;

import com.blog.platform.dto.UserResponse;
import com.blog.platform.model.enums.Role;
import com.blog.platform.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long userId, @RequestParam Role role) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, role));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/blogs/{blogId}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long blogId) {
        adminService.deleteBlog(blogId);
        return ResponseEntity.noContent().build();
    }
}
