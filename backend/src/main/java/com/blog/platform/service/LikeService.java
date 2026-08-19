package com.blog.platform.service;

public interface LikeService {
    boolean toggleLike(Long blogId, String currentUsername);
    Long getLikeCount(Long blogId);
    boolean isLikedByUser(Long blogId, String currentUsername);
}
