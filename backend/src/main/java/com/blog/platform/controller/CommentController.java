package com.blog.platform.controller;

import com.blog.platform.dto.CommentRequest;
import com.blog.platform.model.entity.Comment;
import com.blog.platform.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/blogs/{blogId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByBlogId(@PathVariable Long blogId) {
        return ResponseEntity.ok(commentService.getCommentsByBlogId(blogId));
    }

    @PostMapping("/blogs/{blogId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long blogId, @Valid @RequestBody CommentRequest request, Authentication authentication) {
        return new ResponseEntity<>(commentService.addComment(blogId, request, authentication.getName()), HttpStatus.CREATED);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Authentication authentication) {
        commentService.deleteComment(commentId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
