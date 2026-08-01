package com.blog.platform.service.impl;

import com.blog.platform.dto.UserResponse;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.*;
import com.blog.platform.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final CategoryRepository categoryRepository;

    public AdminServiceImpl(UserRepository userRepository, BlogRepository blogRepository,
                            CommentRepository commentRepository, LikeRepository likeRepository,
                            CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Map<String, Object> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBlogs", blogRepository.count());
        stats.put("totalComments", commentRepository.count());
        stats.put("totalLikes", likeRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        return stats;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setRole(role);
        User updated = userRepository.save(user);
        return mapToUserResponse(updated);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    public void deleteBlog(Long blogId) {
        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog not found with ID: " + blogId);
        }
        blogRepository.deleteById(blogId);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getEnabled(),
                user.getCreatedAt()
        );
    }
}
