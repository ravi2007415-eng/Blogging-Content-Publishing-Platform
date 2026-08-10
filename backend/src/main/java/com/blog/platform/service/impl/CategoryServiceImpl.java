package com.blog.platform.service.impl;

import com.blog.platform.dto.CategoryRequest;
import com.blog.platform.exception.DuplicateResourceException;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.Category;
import com.blog.platform.model.entity.SubCategory;
import com.blog.platform.repository.CategoryRepository;
import com.blog.platform.repository.SubCategoryRepository;
import com.blog.platform.service.CategoryService;
import com.blog.platform.util.ValidationUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ValidationUtil validationUtil;

    public CategoryServiceImpl(CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository, ValidationUtil validationUtil) {
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.validationUtil = validationUtil;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Override
    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    @Override
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category name already exists");
        }
        String slug = validationUtil.toSlug(request.getName());
        Category category = new Category(null, request.getName(), slug, request.getDescription());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);
        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName());
            category.setSlug(validationUtil.toSlug(request.getName()));
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public SubCategory createSubCategory(Long categoryId, String name, String description) {
        Category parent = getCategoryById(categoryId);
        String slug = validationUtil.toSlug(name);
        SubCategory subCategory = new SubCategory(null, name, slug, description, parent);
        return subCategoryRepository.save(subCategory);
    }

    @Override
    public void deleteSubCategory(Long subCategoryId) {
        if (!subCategoryRepository.existsById(subCategoryId)) {
            throw new ResourceNotFoundException("SubCategory not found with ID: " + subCategoryId);
        }
        subCategoryRepository.deleteById(subCategoryId);
    }
}

