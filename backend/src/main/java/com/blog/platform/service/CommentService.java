package com.blog.platform.service;

import com.blog.platform.dto.CommentRequest;
import com.blog.platform.model.entity.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> getCommentsByBlogId(Long blogId);
    Comment addComment(Long blogId, CommentRequest request, String currentUsername);
    void deleteComment(Long commentId, String currentUsername);
}
