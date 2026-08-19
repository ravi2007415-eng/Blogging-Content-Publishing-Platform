package com.blog.platform.service;

import com.blog.platform.dto.TagRequest;
import com.blog.platform.model.entity.Tag;
import java.util.List;

public interface TagService {
    List<Tag> getAllTags();
    Tag getTagById(Long id);
    Tag createTag(TagRequest request);
}
