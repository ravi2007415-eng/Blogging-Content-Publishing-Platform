package com.blog.platform.service.impl;

import com.blog.platform.dto.BlogResponse;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.BlogStatus;
import com.blog.platform.repository.BlogRepository;
import com.blog.platform.repository.CommentRepository;
import com.blog.platform.repository.LikeRepository;
import com.blog.platform.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService {

    private final BlogRepository blogRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public SearchServiceImpl(BlogRepository blogRepository, LikeRepository likeRepository, CommentRepository commentRepository) {
        this.blogRepository = blogRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public Page<BlogResponse> searchBlogs(String query, Pageable pageable) {
        return blogRepository.searchBlogs(query, pageable).map(this::mapToBlogResponse);
    }

    @Override
    public Page<BlogResponse> filterByCategory(String categorySlug, Pageable pageable) {
        return blogRepository.findByCategorySlugAndStatus(categorySlug, BlogStatus.PUBLISHED, pageable).map(this::mapToBlogResponse);
    }

    @Override
    public Page<BlogResponse> filterByTag(String tagSlug, Pageable pageable) {
        return blogRepository.findByTagSlugAndStatus(tagSlug, BlogStatus.PUBLISHED, pageable).map(this::mapToBlogResponse);
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
