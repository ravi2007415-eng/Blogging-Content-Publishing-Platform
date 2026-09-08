# 🗄️ Database Schema & Entity-Relationship (ER) Diagram

This document details the database design, tables, constraints, indices, and relationships for the **Blogging & Content Publishing Platform**.

---

## 📊 Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BLOGS : "authors (1:N)"
    USERS ||--o{ COMMENTS : "writes (1:N)"
    USERS ||--o{ LIKES : "likes (1:N)"
    USERS ||--o{ BOOKMARKS : "saves (1:N)"
    CATEGORIES ||--o{ BLOGS : "categorizes (1:N)"
    BLOGS ||--o{ COMMENTS : "has (1:N)"
    BLOGS ||--o{ LIKES : "receives (1:N)"
    BLOGS ||--o{ BOOKMARKS : "saved in (1:N)"
    BLOGS }|--|{ TAGS : "blog_tags (M:N)"

    USERS {
        BIGINT id PK "Auto Increment"
        VARCHAR username UK "Unique, 50 chars"
        VARCHAR email UK "Unique, 100 chars"
        VARCHAR password "BCrypt Hash"
        VARCHAR full_name "100 chars"
        TEXT bio "Nullable"
        VARCHAR avatar_url "500 chars"
        VARCHAR role "DEFAULT 'ROLE_USER'"
        BOOLEAN enabled "DEFAULT TRUE"
        TIMESTAMP created_at "Current timestamp"
        TIMESTAMP updated_at "On update timestamp"
    }

    CATEGORIES {
        BIGINT id PK "Auto Increment"
        VARCHAR name UK "Unique, 50 chars"
        VARCHAR slug UK "Unique, 60 chars"
        VARCHAR description "255 chars"
        TIMESTAMP created_at "Current timestamp"
    }

    BLOGS {
        BIGINT id PK "Auto Increment"
        VARCHAR title "255 chars"
        VARCHAR slug UK "Unique, 280 chars"
        VARCHAR summary "500 chars"
        LONGTEXT content "Markdown / Rich text"
        VARCHAR cover_image_url "500 chars"
        VARCHAR status "DEFAULT 'DRAFT'"
        INT views_count "DEFAULT 0"
        BIGINT author_id FK "References users(id)"
        BIGINT category_id FK "References categories(id)"
        TIMESTAMP created_at "Current timestamp"
        TIMESTAMP updated_at "On update timestamp"
    }

    TAGS {
        BIGINT id PK "Auto Increment"
        VARCHAR name UK "Unique, 50 chars"
        VARCHAR slug UK "Unique, 60 chars"
    }

    BLOG_TAGS {
        BIGINT blog_id PK,FK "References blogs(id)"
        BIGINT tag_id PK,FK "References tags(id)"
    }

    COMMENTS {
        BIGINT id PK "Auto Increment"
        TEXT content "Comment text"
        BIGINT blog_id FK "References blogs(id)"
        BIGINT user_id FK "References users(id)"
        TIMESTAMP created_at "Current timestamp"
    }

    LIKES {
        BIGINT id PK "Auto Increment"
        BIGINT blog_id FK "References blogs(id)"
        BIGINT user_id FK "References users(id)"
        TIMESTAMP created_at "Current timestamp"
    }

    BOOKMARKS {
        BIGINT id PK "Auto Increment"
        BIGINT blog_id FK "References blogs(id)"
        BIGINT user_id FK "References users(id)"
        TIMESTAMP created_at "Current timestamp"
    }
```

---

## 📋 Table Specifications & Constraints

| Table Name | Description | Key Constraints | Foreign Keys |
|---|---|---|---|
| **`users`** | Stores user profiles and authentication data | `id` (PK), `username` (UK), `email` (UK) | None |
| **`categories`** | Organizes blogs into hierarchical topics | `id` (PK), `name` (UK), `slug` (UK) | None |
| **`blogs`** | Contains published & draft blog posts | `id` (PK), `slug` (UK) | `author_id` -> `users(id)`<br/>`category_id` -> `categories(id)` |
| **`tags`** | Keywords for article tagging and search | `id` (PK), `name` (UK), `slug` (UK) | None |
| **`blog_tags`** | Many-to-Many junction between blogs and tags | `(blog_id, tag_id)` (Composite PK) | `blog_id` -> `blogs(id)`<br/>`tag_id` -> `tags(id)` |
| **`comments`** | Reader comments on blog posts | `id` (PK) | `blog_id` -> `blogs(id)`<br/>`user_id` -> `users(id)` |
| **`likes`** | Unique user likes per blog post | `id` (PK), `(blog_id, user_id)` (UK) | `blog_id` -> `blogs(id)`<br/>`user_id` -> `users(id)` |
| **`bookmarks`** | Reading list bookmarks saved by users | `id` (PK), `(blog_id, user_id)` (UK) | `blog_id` -> `blogs(id)`<br/>`user_id` -> `users(id)` |

---

## ⚡ Performance Indices

- `idx_blogs_status`: Optimizes filtering by `PUBLISHED` vs `DRAFT` status.
- `idx_blogs_author`: Accelerates fetching articles authored by a specific user.
- `idx_blogs_category`: Speeds up category-based article listings.
- `idx_comments_blog`: Fast retrieval of comment threads on article pages.
