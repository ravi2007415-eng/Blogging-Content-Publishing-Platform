package com.blog.platform.repository;

import com.blog.platform.model.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByBlogIdAndUserId(Long blogId, Long userId);
    Boolean existsByBlogIdAndUserId(Long blogId, Long userId);
    Long countByBlogId(Long blogId);
}
