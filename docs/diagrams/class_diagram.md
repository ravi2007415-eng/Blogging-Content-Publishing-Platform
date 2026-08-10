# Class Diagram

```mermaid
classDiagram
    class User {
        +Long id
        +String username
        +String email
        +String password
        +String fullName
        +String bio
        +String avatarUrl
        +Role role
        +Boolean enabled
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Blog {
        +Long id
        +String title
        +String slug
        +String summary
        +String content
        +String coverImageUrl
        +BlogStatus status
        +Integer viewsCount
        +String subCategoryName
        +User author
        +Category category
        +Set~Tag~ tags
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Category {
        +Long id
        +String name
        +String slug
        +String description
        +List~SubCategory~ subCategories
        +LocalDateTime createdAt
    }

    class SubCategory {
        +Long id
        +String name
        +String slug
        +String description
        +Category category
        +LocalDateTime createdAt
    }

    class Tag {
        +Long id
        +String name
        +String slug
    }

    class BlogTag {
        +BlogTagId id
        +Blog blog
        +Tag tag
    }

    class Comment {
        +Long id
        +String content
        +Blog blog
        +User user
        +LocalDateTime createdAt
    }

    class Like {
        +Long id
        +Blog blog
        +User user
        +LocalDateTime createdAt
    }

    class Bookmark {
        +Long id
        +Blog blog
        +User user
        +LocalDateTime createdAt
    }

    class News {
        +Long id
        +String title
        +String slug
        +String summary
        +String content
        +String categoryName
        +String subCategoryName
        +String imageUrl
        +Boolean isBreaking
        +Boolean isTrending
        +Boolean isTopStory
        +String authorName
        +Integer viewsCount
        +LocalDateTime publishedAt
        +LocalDateTime createdAt
    }

    class Event {
        +Long id
        +String title
        +String description
        +String categoryName
        +String subCategoryName
        +String eventDate
        +String eventTime
        +String location
        +String registrationUrl
        +String status
        +String organizer
        +String coverImageUrl
        +LocalDateTime createdAt
    }

    class Role {
        <<enumeration>>
        ROLE_USER
        ROLE_AUTHOR
        ROLE_ADMIN
    }

    class BlogStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        ARCHIVED
    }

    User "1" -- "*" Blog : writes
    User "1" -- "*" Comment : posts
    User "1" -- "*" Like : gives
    User "1" -- "*" Bookmark : saves
    Category "1" -- "*" SubCategory : contains
    Category "1" -- "*" Blog : categorizes
    Blog "*" -- "*" Tag : tagged with
    Blog "1" -- "*" Comment : contains
    Blog "1" -- "*" Like : accumulates
    Blog "1" -- "*" Bookmark : included in
    User --> Role
    Blog --> BlogStatus
```
