package com.blog.platform.service.impl;

import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Like;
import com.blog.platform.model.entity.User;
import com.blog.platform.repository.BlogRepository;
import com.blog.platform.repository.LikeRepository;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.service.LikeService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public LikeServiceImpl(LikeRepository likeRepository, BlogRepository blogRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean toggleLike(Long blogId, String currentUsername) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Optional<Like> existing = likeRepository.findByBlogIdAndUserId(blogId, user.getId());
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return false;
        } else {
            likeRepository.save(new Like(blog, user));
            return true;
        }
    }

    @Override
    public Long getLikeCount(Long blogId) {
        return likeRepository.countByBlogId(blogId);
    }

    @Override
    public boolean isLikedByUser(Long blogId, String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        if (user == null) return false;
        return likeRepository.existsByBlogIdAndUserId(blogId, user.getId());
    }
}
