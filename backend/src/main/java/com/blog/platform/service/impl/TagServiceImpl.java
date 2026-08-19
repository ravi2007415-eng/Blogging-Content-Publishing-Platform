package com.blog.platform.service.impl;

import com.blog.platform.dto.TagRequest;
import com.blog.platform.exception.DuplicateResourceException;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.Tag;
import com.blog.platform.repository.TagRepository;
import com.blog.platform.service.TagService;
import com.blog.platform.util.ValidationUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final ValidationUtil validationUtil;

    public TagServiceImpl(TagRepository tagRepository, ValidationUtil validationUtil) {
        this.tagRepository = tagRepository;
        this.validationUtil = validationUtil;
    }

    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
    }

    @Override
    public Tag createTag(TagRequest request) {
        if (tagRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Tag already exists: " + request.getName());
        }
        String slug = validationUtil.toSlug(request.getName());
        Tag tag = new Tag(null, request.getName().trim(), slug);
        return tagRepository.save(tag);
    }
}
