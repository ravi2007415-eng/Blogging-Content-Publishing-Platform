package com.blog.platform.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 280)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Column(name = "category_name", nullable = false, length = 80)
    private String categoryName;

    @Column(name = "sub_category_name", length = 80)
    private String subCategoryName;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_breaking")
    private Boolean isBreaking = false;

    @Column(name = "is_trending")
    private Boolean isTrending = false;

    @Column(name = "is_top_story")
    private Boolean isTopStory = false;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public News() {}

    public News(Long id, String title, String slug, String summary, String content, String categoryName, String subCategoryName, String imageUrl, Boolean isBreaking, Boolean isTrending, Boolean isTopStory, String authorName, Integer viewsCount, LocalDateTime publishedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.content = content;
        this.categoryName = categoryName;
        this.subCategoryName = subCategoryName;
        this.imageUrl = imageUrl;
        this.isBreaking = isBreaking;
        this.isTrending = isTrending;
        this.isTopStory = isTopStory;
        this.authorName = authorName;
        this.viewsCount = viewsCount;
        this.publishedAt = publishedAt != null ? publishedAt : LocalDateTime.now();
    }

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
