package com.blog.platform.service.impl;

import com.blog.platform.dto.BlogResponse;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Bookmark;
import com.blog.platform.model.entity.User;
import com.blog.platform.repository.*;
import com.blog.platform.service.BookmarkService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public BookmarkServiceImpl(BookmarkRepository bookmarkRepository, BlogRepository blogRepository,
                               UserRepository userRepository, LikeRepository likeRepository,
                               CommentRepository commentRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public boolean toggleBookmark(Long blogId, String currentUsername) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Optional<Bookmark> existing = bookmarkRepository.findByBlogIdAndUserId(blogId, user.getId());
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            bookmarkRepository.save(new Bookmark(blog, user));
            return true;
        }
    }

    @Override
    public List<BlogResponse> getUserBookmarks(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(bm -> mapToBlogResponse(bm.getBlog()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isBookmarkedByUser(Long blogId, String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        if (user == null) return false;
        return bookmarkRepository.existsByBlogIdAndUserId(blogId, user.getId());
    }

    private BlogResponse mapToBlogResponse(Blog blog) {
        BlogResponse res = new BlogResponse();
        res.setId(blog.getId());
        res.setTitle(blog.getTitle());
        res.setSlug(blog.getSlug());
        res.setSummary(blog.getSummary());
        res.setContent(blog.getContent());
        res.setCoverImageUrl(blog.getCoverImageUrl());
        res.setStatus(blog.getStatus());
        res.setViewsCount(blog.getViewsCount());
        res.setLikesCount(likeRepository.countByBlogId(blog.getId()));
        res.setCommentsCount(commentRepository.countByBlogId(blog.getId()));

        User author = blog.getAuthor();
        res.setAuthor(new UserResponse(
                author.getId(), author.getUsername(), author.getEmail(),
                author.getFullName(), author.getBio(), author.getAvatarUrl(),
                author.getRole(), author.getEnabled(), author.getCreatedAt()
        ));
        res.setCategory(blog.getCategory());
        res.setTags(blog.getTags());
        res.setCreatedAt(blog.getCreatedAt());
        res.setUpdatedAt(blog.getUpdatedAt());
        return res;
    }
}
