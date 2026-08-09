package com.blog.platform.dto;

import java.time.LocalDateTime;

public class NewsRequest {
    private String title;
    private String summary;
    private String content;
    private String categoryName;
    private String subCategoryName;
    private String imageUrl;
    private Boolean isBreaking = false;
    private Boolean isTrending = false;
    private Boolean isTopStory = false;
    private String authorName;

    public NewsRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

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
}
