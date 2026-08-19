package com.blog.platform.controller;

import com.blog.platform.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/blogs")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{blogId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long blogId, Authentication authentication) {
        boolean liked = likeService.toggleLike(blogId, authentication.getName());
        Long totalLikes = likeService.getLikeCount(blogId);
        return ResponseEntity.ok(Map.of("liked", liked, "totalLikes", totalLikes));
    }

    @GetMapping("/{blogId}/like-count")
    public ResponseEntity<Map<String, Object>> getLikeCount(@PathVariable Long blogId, Authentication authentication) {
        Long totalLikes = likeService.getLikeCount(blogId);
        boolean liked = authentication != null && likeService.isLikedByUser(blogId, authentication.getName());
        return ResponseEntity.ok(Map.of("totalLikes", totalLikes, "liked", liked));
    }
}
