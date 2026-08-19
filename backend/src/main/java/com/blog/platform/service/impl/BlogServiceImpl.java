package com.blog.platform.service.impl;

import com.blog.platform.dto.BlogRequest;
import com.blog.platform.dto.BlogResponse;
import com.blog.platform.dto.UserResponse;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.exception.UnauthorizedException;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Category;
import com.blog.platform.model.entity.Tag;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.BlogStatus;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.*;
import com.blog.platform.service.BlogService;
import com.blog.platform.util.ValidationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ValidationUtil validationUtil;

    public BlogServiceImpl(BlogRepository blogRepository, UserRepository userRepository,
                           CategoryRepository categoryRepository, TagRepository tagRepository,
                           LikeRepository likeRepository, CommentRepository commentRepository,
                           ValidationUtil validationUtil) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.validationUtil = validationUtil;
    }

    @Override
    public Page<BlogResponse> getAllPublishedBlogs(Pageable pageable) {
        return blogRepository.findByStatus(BlogStatus.PUBLISHED, pageable).map(this::mapToBlogResponse);
    }

    @Override
    @Transactional
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with ID: " + id));
        blog.setViewsCount(blog.getViewsCount() + 1);
        Blog saved = blogRepository.save(blog);
        return mapToBlogResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
        blog.setViewsCount(blog.getViewsCount() + 1);
        Blog saved = blogRepository.save(blog);
        return mapToBlogResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse createBlog(BlogRequest request, String currentUsername) {
        User author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + currentUsername));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        String baseSlug = validationUtil.toSlug(request.getTitle());
        blog.setSlug(baseSlug + "-" + System.currentTimeMillis() % 10000);
        blog.setSummary(request.getSummary());
        blog.setContent(request.getContent());
        blog.setCoverImageUrl(request.getCoverImageUrl() != null && !request.getCoverImageUrl().isBlank()
                ? request.getCoverImageUrl() : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800");
        blog.setStatus(request.getStatus() != null ? request.getStatus() : BlogStatus.DRAFT);
        blog.setAuthor(author);
        blog.setCategory(category);

        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                String slug = validationUtil.toSlug(tagName);
                Tag tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName(tagName.trim());
                    newTag.setSlug(slug);
                    return tagRepository.save(newTag);
                });
                tags.add(tag);
            }
            blog.setTags(tags);
        }

        Blog saved = blogRepository.save(blog);
        return mapToBlogResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request, String currentUsername) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with ID: " + id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        if (!blog.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.ROLE_ADMIN)) {
            throw new UnauthorizedException("You are not authorized to update this blog post");
        }

        if (request.getTitle() != null) {
            blog.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) blog.setSummary(request.getSummary());
        if (request.getContent() != null) blog.setContent(request.getContent());
        if (request.getCoverImageUrl() != null) blog.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getStatus() != null) blog.setStatus(request.getStatus());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
            blog.setCategory(category);
        }

        if (request.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                String slug = validationUtil.toSlug(tagName);
                Tag tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName(tagName.trim());
                    newTag.setSlug(slug);
                    return tagRepository.save(newTag);
                });
                tags.add(tag);
            }
            blog.setTags(tags);
        }

        Blog updated = blogRepository.save(blog);
        return mapToBlogResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBlog(Long id, String currentUsername) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with ID: " + id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        if (!blog.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.ROLE_ADMIN)) {
            throw new UnauthorizedException("You are not authorized to delete this blog post");
        }

        blogRepository.delete(blog);
    }

    @Override
    public List<BlogResponse> getBlogsByAuthor(String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + username));
        return blogRepository.findByAuthorId(author.getId()).stream().map(this::mapToBlogResponse).collect(Collectors.toList());
    }

    @Override
    public Page<BlogResponse> getBlogsByCategory(String categorySlug, Pageable pageable) {
        return blogRepository.findByCategorySlugAndStatus(categorySlug, BlogStatus.PUBLISHED, pageable).map(this::mapToBlogResponse);
    }

    @Override
    public Page<BlogResponse> getBlogsByTag(String tagSlug, Pageable pageable) {
        return blogRepository.findByTagSlugAndStatus(tagSlug, BlogStatus.PUBLISHED, pageable).map(this::mapToBlogResponse);
    }

    @Override
    public Page<BlogResponse> searchBlogs(String query, Pageable pageable) {
        return blogRepository.searchBlogs(query, pageable).map(this::mapToBlogResponse);
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
