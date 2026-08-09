package com.blog.platform.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_name", nullable = false, length = 80)
    private String categoryName;

    @Column(name = "sub_category_name", nullable = false, length = 80)
    private String subCategoryName;

    @Column(name = "event_date", nullable = false)
    private String eventDate;

    @Column(name = "event_time")
    private String eventTime;

    @Column(nullable = false)
    private String location;

    @Column(name = "registration_url")
    private String registrationUrl;

    @Column(length = 30)
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    @Column(length = 100)
    private String organizer;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Event() {}

    public Event(Long id, String title, String description, String categoryName, String subCategoryName, String eventDate, String eventTime, String location, String registrationUrl, String status, String organizer, String coverImageUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.categoryName = categoryName;
        this.subCategoryName = subCategoryName;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.location = location;
        this.registrationUrl = registrationUrl;
        this.status = status;
        this.organizer = organizer;
        this.coverImageUrl = coverImageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getSubCategoryName() { return subCategoryName; }
    public void setSubCategoryName(String subCategoryName) { this.subCategoryName = subCategoryName; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRegistrationUrl() { return registrationUrl; }
    public void setRegistrationUrl(String registrationUrl) { this.registrationUrl = registrationUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
