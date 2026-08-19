package com.blog.platform.repository;

import com.blog.platform.model.entity.BlogTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogTagRepository extends JpaRepository<BlogTag, BlogTag.BlogTagId> {
    List<BlogTag> findByBlogId(Long blogId);
    void deleteByBlogId(Long blogId);
}
