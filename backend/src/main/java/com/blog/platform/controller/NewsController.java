package com.blog.platform.controller;

import com.blog.platform.dto.NewsRequest;
import com.blog.platform.dto.NewsResponse;
import com.blog.platform.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponse>> getAllNews(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(newsService.getAllNews(category, subCategory, sort));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<NewsResponse>> getLatestNews(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(newsService.getLatestNews(limit));
    }

    @GetMapping("/breaking")
    public ResponseEntity<List<NewsResponse>> getBreakingNews() {
        return ResponseEntity.ok(newsService.getBreakingNews());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<NewsResponse>> getTrendingNews() {
        return ResponseEntity.ok(newsService.getTrendingNews());
    }

    @GetMapping("/top-stories")
    public ResponseEntity<List<NewsResponse>> getTopStories() {
        return ResponseEntity.ok(newsService.getTopStories());
    }

    @GetMapping("/search")
    public ResponseEntity<List<NewsResponse>> searchNews(@RequestParam("q") String query) {
        return ResponseEntity.ok(newsService.searchNews(query));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<NewsResponse> getNewsByIdOrSlug(@PathVariable String idOrSlug) {
        return ResponseEntity.ok(newsService.getNewsByIdOrSlug(idOrSlug));
    }

    @PostMapping
    public ResponseEntity<NewsResponse> createNews(@RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.createNews(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponse> updateNews(
            @PathVariable Long id,
            @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
