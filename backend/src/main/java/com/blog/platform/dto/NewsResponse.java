package com.blog.platform.dto;

import java.time.LocalDateTime;

public class NewsResponse {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String categoryName;
    private String subCategoryName;
    private String imageUrl;
    private Boolean isBreaking;
    private Boolean isTrending;
    private Boolean isTopStory;
    private String authorName;
    private Integer viewsCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;

    public NewsResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getSubCategoryName() { return subCategoryName; }
    public void setSubCategoryName(String subCategoryName) { this.subCategoryName = subCategoryName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsBreaking() { return isBreaking; }
    public void setIsBreaking(Boolean isBreaking) { this.isBreaking = isBreaking; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public Boolean getIsTopStory() { return isTopStory; }
    public void setIsTopStory(Boolean isTopStory) { this.isTopStory = isTopStory; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
