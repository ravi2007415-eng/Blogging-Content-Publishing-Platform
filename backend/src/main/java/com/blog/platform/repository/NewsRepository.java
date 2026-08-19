package com.blog.platform.repository;

import com.blog.platform.model.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    Optional<News> findBySlug(String slug);

    List<News> findAllByOrderByPublishedAtDesc();

    List<News> findByIsBreakingTrueOrderByPublishedAtDesc();

    List<News> findByIsTrendingTrueOrderByPublishedAtDesc();

    List<News> findByIsTopStoryTrueOrderByPublishedAtDesc();

    List<News> findByCategoryNameIgnoreCaseOrderByPublishedAtDesc(String categoryName);

    List<News> findByCategoryNameIgnoreCaseAndSubCategoryNameIgnoreCaseOrderByPublishedAtDesc(String categoryName, String subCategoryName);

    @Query("SELECT n FROM News n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY n.publishedAt DESC")
    List<News> searchNews(@Param("query") String query);
}
