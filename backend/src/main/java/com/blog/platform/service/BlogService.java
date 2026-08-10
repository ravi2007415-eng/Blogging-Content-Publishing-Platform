package com.blog.platform.service;

import com.blog.platform.dto.BlogRequest;
import com.blog.platform.dto.BlogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogService {
    Page<BlogResponse> getAllPublishedBlogs(Pageable pageable);
    BlogResponse getBlogById(Long id);
    BlogResponse getBlogBySlug(String slug);
    BlogResponse createBlog(BlogRequest request, String currentUsername);
    BlogResponse updateBlog(Long id, BlogRequest request, String currentUsername);
    void deleteBlog(Long id, String currentUsername);
    List<BlogResponse> getBlogsByAuthor(String username);
    Page<BlogResponse> getBlogsByCategory(String categorySlug, Pageable pageable);
    List<BlogResponse> getBlogsByCategoryAndSubCategory(String categorySlug, String subCategorySlug);
    Page<BlogResponse> getBlogsByTag(String tagSlug, Pageable pageable);
    Page<BlogResponse> searchBlogs(String query, Pageable pageable);
}

