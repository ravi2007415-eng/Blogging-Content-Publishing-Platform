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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class BlogServiceImpl implements BlogService {

    private static final Logger logger = LoggerFactory.getLogger(BlogServiceImpl.class);

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
        blog.setViewsCount((blog.getViewsCount() != null ? blog.getViewsCount() : 0) + 1);
        Blog saved = blogRepository.save(blog);
        return mapToBlogResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
        blog.setViewsCount((blog.getViewsCount() != null ? blog.getViewsCount() : 0) + 1);
        Blog saved = blogRepository.save(blog);
        return mapToBlogResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse createBlog(BlogRequest request, String currentUsername) {
        if (currentUsername == null || currentUsername.isBlank()) {
            throw new UnauthorizedException("User authentication required to publish an article.");
        }

        User author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + currentUsername));

        Category category = resolveCategory(request);

        Blog blog = new Blog();
        blog.setTitle(request.getTitle().trim());

        // Slug generation with collision avoidance
        String baseSlug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? validationUtil.toSlug(request.getSlug())
                : validationUtil.toSlug(request.getTitle());
        
        if (baseSlug == null || baseSlug.isBlank()) {
            baseSlug = "article-" + System.currentTimeMillis();
        }

        String candidateSlug = baseSlug;
        int suffix = 1;
        while (blogRepository.existsBySlug(candidateSlug)) {
            candidateSlug = baseSlug + "-" + suffix + "-" + (System.currentTimeMillis() % 10000);
            suffix++;
        }
        blog.setSlug(candidateSlug);

        // Summary
        if (request.getSummary() != null && !request.getSummary().isBlank()) {
            blog.setSummary(request.getSummary().trim());
        } else {
            String content = request.getContent() != null ? request.getContent().trim() : "";
            blog.setSummary(content.length() > 200 ? content.substring(0, 197) + "..." : content);
        }

        blog.setContent(request.getContent() != null ? request.getContent().trim() : "");
        blog.setCoverImageUrl(request.getCoverImageUrl() != null && !request.getCoverImageUrl().isBlank()
                ? request.getCoverImageUrl().trim()
                : "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80");
        blog.setStatus(request.getStatus() != null ? request.getStatus() : BlogStatus.PUBLISHED);
        blog.setSubCategoryName(request.getSubCategoryName() != null && !request.getSubCategoryName().isBlank()
                ? request.getSubCategoryName().trim() : "General");
        blog.setAuthor(author);
        blog.setCategory(category);
        blog.setViewsCount(0);

        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                if (tagName != null && !tagName.isBlank()) {
                    String slug = validationUtil.toSlug(tagName.trim());
                    Tag tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName.trim());
                        newTag.setSlug(slug);
                        return tagRepository.save(newTag);
                    });
                    tags.add(tag);
                }
            }
            blog.setTags(tags);
        }

        Blog saved = blogRepository.save(blog);
        logger.info("Successfully persisted blog article in MySQL: ID={}, slug={}, author={}, category={}",
                saved.getId(), saved.getSlug(), author.getUsername(), category.getName());

        return mapToBlogResponse(saved);
    }

    private Category resolveCategory(BlogRequest request) {
        if (request.getCategoryId() != null) {
            Optional<Category> byId = categoryRepository.findById(request.getCategoryId());
            if (byId.isPresent()) return byId.get();
        }

        if (request.getCategorySlug() != null && !request.getCategorySlug().isBlank()) {
            Optional<Category> bySlug = categoryRepository.findBySlugIgnoreCase(request.getCategorySlug().trim());
            if (bySlug.isPresent()) return bySlug.get();
        }

        if (request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            Optional<Category> byName = categoryRepository.findByNameIgnoreCase(request.getCategoryName().trim());
            if (byName.isPresent()) return byName.get();
        }

        // Try to get any existing category
        List<Category> allCategories = categoryRepository.findAll();
        if (!allCategories.isEmpty()) {
            return allCategories.get(0);
        }

        // Auto create default category if database is completely empty
        String catName = (request.getCategoryName() != null && !request.getCategoryName().isBlank())
                ? request.getCategoryName().trim() : "Technology";
        String catSlug = validationUtil.toSlug(catName);
        Category defaultCategory = new Category(null, catName, catSlug, "General Content Channel");
        return categoryRepository.save(defaultCategory);
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

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            blog.setTitle(request.getTitle().trim());
        }
        if (request.getSummary() != null) blog.setSummary(request.getSummary().trim());
        if (request.getContent() != null && !request.getContent().isBlank()) blog.setContent(request.getContent().trim());
        if (request.getCoverImageUrl() != null) blog.setCoverImageUrl(request.getCoverImageUrl().trim());
        if (request.getStatus() != null) blog.setStatus(request.getStatus());
        if (request.getSubCategoryName() != null) blog.setSubCategoryName(request.getSubCategoryName().trim());

        if (request.getCategoryId() != null || request.getCategorySlug() != null || request.getCategoryName() != null) {
            Category category = resolveCategory(request);
            blog.setCategory(category);
        }

        if (request.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                if (tagName != null && !tagName.isBlank()) {
                    String slug = validationUtil.toSlug(tagName.trim());
                    Tag tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName.trim());
                        newTag.setSlug(slug);
                        return tagRepository.save(newTag);
                    });
                    tags.add(tag);
                }
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
        res.setSubCategoryName(blog.getSubCategoryName());
        res.setViewsCount(blog.getViewsCount() != null ? blog.getViewsCount() : 0);
        res.setLikesCount(likeRepository.countByBlogId(blog.getId()));
        res.setCommentsCount(commentRepository.countByBlogId(blog.getId()));

        User author = blog.getAuthor();
        if (author != null) {
            res.setAuthor(new UserResponse(
                    author.getId(), author.getUsername(), author.getEmail(),
                    author.getFullName(), author.getBio(), author.getAvatarUrl(),
                    author.getRole(), author.getEnabled(), author.getCreatedAt()
            ));
        }
        res.setCategory(blog.getCategory());
        res.setTags(blog.getTags());
        res.setCreatedAt(blog.getCreatedAt());
        res.setUpdatedAt(blog.getUpdatedAt());
        return res;
    }
}

