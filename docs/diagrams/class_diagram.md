# Class Diagram (Human / Hand-Drawn Style)

> **Hand-Drawn Diagram View**: This domain model class diagram is styled with a hand-drawn human sketch aesthetic.

![Domain Class Diagram (Hand-Drawn)](class_diagram.svg)

---

## Mermaid Class Diagram (Hand-Drawn Look)

```mermaid
%%{init: {
  'theme': 'neutral',
  'look': 'handDrawn',
  'themeVariables': {
    'fontFamily': 'Architects Daughter, Caveat, Comic Sans MS, cursive',
    'primaryColor': '#F0F9FF',
    'primaryBorderColor': '#0284C7',
    'lineColor': '#334155',
    'tertiaryColor': '#FEF3C7'
  }
}}%%
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
        +User author
        +Category category
        +Set~Tag~ tags
        +List~Comment~ comments
    }

    class Category {
        +Long id
        +String name
        +String slug
        +String description
    }

    class Tag {
        +Long id
        +String name
        +String slug
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
    Category "1" -- "*" Blog : categorizes
    Blog "*" -- "*" Tag : tagged with
    Blog "1" -- "*" Comment : contains
    Blog "1" -- "*" Like : accumulates
    Blog "1" -- "*" Bookmark : included in
    User --> Role
    Blog --> BlogStatus
```

---

## Domain Entity Overview

| Entity | Description | Key Relationships |
| :--- | :--- | :--- |
| **`User`** | System user with authentication credentials, roles, and profile details | Writes `Blog`, posts `Comment`, gives `Like`, saves `Bookmark` |
| **`Blog`** | Core publishing article/post entity | Belongs to `User` (author) and `Category`, has many `Tag`, `Comment`, `Like`, `Bookmark` |
| **`Category`** | Topic classification for blog posts | One-to-Many association with `Blog` |
| **`Tag`** | Label/keyword attached to posts | Many-to-Many association with `Blog` |
| **`Comment`** | User comment on a blog post | Belongs to `User` and `Blog` |
| **`Like`** | User appreciation vote for a blog post | Belongs to `User` and `Blog` (Unique per user/blog) |
| **`Bookmark`** | User saved post bookmark | Belongs to `User` and `Blog` (Unique per user/blog) |
| **`News`** | News announcement item | Includes trending, breaking, and category metadata |
| **`Event`** | Platform event / web event | Includes date, time, location, organizer, registration URL |

