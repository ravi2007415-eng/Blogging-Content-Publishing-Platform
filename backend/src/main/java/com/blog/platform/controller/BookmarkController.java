package com.blog.platform.controller;

import com.blog.platform.dto.BlogResponse;
import com.blog.platform.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/blogs/{blogId}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable Long blogId, Authentication authentication) {
        boolean bookmarked = bookmarkService.toggleBookmark(blogId, authentication.getName());
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }

    @GetMapping("/bookmarks/my-bookmarks")
    public ResponseEntity<List<BlogResponse>> getMyBookmarks(Authentication authentication) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(authentication.getName()));
    }
}
