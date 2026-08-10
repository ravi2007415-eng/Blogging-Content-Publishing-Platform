package com.blog.platform.repository;

import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.enums.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);
    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);
    List<Blog> findByAuthorId(Long authorId);
    Page<Blog> findByAuthorId(Long authorId, Pageable pageable);
    List<Blog> findByAuthorUsernameOrderByCreatedAtDesc(String username);
    Page<Blog> findByCategoryIdAndStatus(Long categoryId, BlogStatus status, Pageable pageable);
    Page<Blog> findByCategorySlugAndStatus(String slug, BlogStatus status, Pageable pageable);
    List<Blog> findByCategorySlugAndStatusOrderByCreatedAtDesc(String slug, BlogStatus status);

    @Query("SELECT b FROM Blog b WHERE b.status = :status AND (LOWER(b.category.slug) = LOWER(:categorySlug) OR LOWER(b.category.name) = LOWER(:categorySlug)) AND LOWER(b.subCategoryName) = LOWER(:subCategory)")
    List<Blog> findByCategoryAndSubCategory(@Param("categorySlug") String categorySlug, @Param("subCategory") String subCategory, @Param("status") BlogStatus status);

    @Query("SELECT b FROM Blog b JOIN b.tags t WHERE t.slug = :tagSlug AND b.status = :status")
    Page<Blog> findByTagSlugAndStatus(@Param("tagSlug") String tagSlug, @Param("status") BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.summary) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.subCategoryName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author.fullName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Blog> searchBlogs(@Param("query") String query, Pageable pageable);

    Boolean existsBySlug(String slug);
}

