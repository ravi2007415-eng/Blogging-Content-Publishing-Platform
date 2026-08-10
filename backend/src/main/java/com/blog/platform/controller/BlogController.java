package com.blog.platform.controller;

import com.blog.platform.dto.BlogRequest;
import com.blog.platform.dto.BlogResponse;
import com.blog.platform.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogResponse>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(blogService.getAllPublishedBlogs(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogResponse> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @GetMapping("/category/{categorySlug}")
    public ResponseEntity<Page<BlogResponse>> getBlogsByCategory(
            @PathVariable String categorySlug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(blogService.getBlogsByCategory(categorySlug, pageable));
    }

    @GetMapping("/category/{categorySlug}/{subCategorySlug}")
    public ResponseEntity<List<BlogResponse>> getBlogsByCategoryAndSubCategory(
            @PathVariable String categorySlug,
            @PathVariable String subCategorySlug) {
        return ResponseEntity.ok(blogService.getBlogsByCategoryAndSubCategory(categorySlug, subCategorySlug));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogRequest request, Authentication authentication) {
        return new ResponseEntity<>(blogService.createBlog(request, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest request, Authentication authentication) {
        return ResponseEntity.ok(blogService.updateBlog(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id, Authentication authentication) {
        blogService.deleteBlog(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-blogs")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public ResponseEntity<List<BlogResponse>> getMyBlogs(Authentication authentication) {
        return ResponseEntity.ok(blogService.getBlogsByAuthor(authentication.getName()));
    }
}

