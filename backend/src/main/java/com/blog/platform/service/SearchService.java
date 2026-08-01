package com.blog.platform.service;

import com.blog.platform.dto.BlogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SearchService {
    Page<BlogResponse> searchBlogs(String query, Pageable pageable);
    Page<BlogResponse> filterByCategory(String categorySlug, Pageable pageable);
    Page<BlogResponse> filterByTag(String tagSlug, Pageable pageable);
}
