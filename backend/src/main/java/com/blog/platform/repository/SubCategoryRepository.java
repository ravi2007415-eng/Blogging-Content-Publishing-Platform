package com.blog.platform.repository;

import com.blog.platform.model.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    List<SubCategory> findByCategoryId(Long categoryId);
    Optional<SubCategory> findBySlug(String slug);
    Optional<SubCategory> findByNameIgnoreCaseAndCategoryId(String name, Long categoryId);
}
