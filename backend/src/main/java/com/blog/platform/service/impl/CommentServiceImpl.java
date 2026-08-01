package com.blog.platform.service.impl;

import com.blog.platform.dto.CommentRequest;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.exception.UnauthorizedException;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Comment;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.BlogRepository;
import com.blog.platform.repository.CommentRepository;
import com.blog.platform.repository.UserRepository;
import com.blog.platform.service.CommentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository, BlogRepository blogRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Comment> getCommentsByBlogId(Long blogId) {
        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog not found with ID: " + blogId);
        }
        return commentRepository.findByBlogIdOrderByCreatedAtDesc(blogId);
    }

    @Override
    public Comment addComment(Long blogId, CommentRequest request, String currentUsername) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Comment comment = new Comment(null, request.getContent(), blog, user);
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, String currentUsername) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        if (!comment.getUser().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.ROLE_ADMIN)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
