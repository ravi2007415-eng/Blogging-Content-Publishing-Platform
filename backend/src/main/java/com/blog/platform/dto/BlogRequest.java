package com.blog.platform.dto;

import com.blog.platform.model.enums.BlogStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public class BlogRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String summary;

    @NotBlank(message = "Content is required")
    private String content;

    private String coverImageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Set<String> tagNames;

    private BlogStatus status = BlogStatus.DRAFT;

    public BlogRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Set<String> getTagNames() { return tagNames; }
    public void setTagNames(Set<String> tagNames) { this.tagNames = tagNames; }

    public BlogStatus getStatus() { return status; }
    public void setStatus(BlogStatus status) { this.status = status; }
}
