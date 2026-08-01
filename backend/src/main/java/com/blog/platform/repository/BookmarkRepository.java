package com.blog.platform.repository;

import com.blog.platform.model.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByBlogIdAndUserId(Long blogId, Long userId);
    Boolean existsByBlogIdAndUserId(Long blogId, Long userId);
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
}
