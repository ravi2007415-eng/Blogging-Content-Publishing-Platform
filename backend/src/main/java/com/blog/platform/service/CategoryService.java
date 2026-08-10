package com.blog.platform.service;

import com.blog.platform.dto.CategoryRequest;
import com.blog.platform.model.entity.Category;
import com.blog.platform.model.entity.SubCategory;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryBySlug(String slug);
    Category createCategory(CategoryRequest request);
    Category updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
    SubCategory createSubCategory(Long categoryId, String name, String description);
    void deleteSubCategory(Long subCategoryId);
}

