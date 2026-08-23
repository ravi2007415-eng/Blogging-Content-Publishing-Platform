# Entity-Relationship (ER) Diagram (Human / Hand-Drawn Style)

> **Hand-Drawn Diagram View**: This relational database schema diagram is styled with a hand-drawn human sketch aesthetic.

![ER Diagram (Hand-Drawn)](er_diagram.svg)

---

## Mermaid ER Diagram (Hand-Drawn Look)

```mermaid
%%{init: {
  'theme': 'neutral',
  'look': 'handDrawn',
  'themeVariables': {
    'fontFamily': 'Architects Daughter, Caveat, Comic Sans MS, cursive',
    'primaryColor': '#ECFDF5',
    'primaryBorderColor': '#059669',
    'lineColor': '#334155',
    'tertiaryColor': '#FEF3C7'
  }
}}%%
erDiagram
    USERS ||--o{ BLOGS : "author of"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--o{ LIKES : "places"
    USERS ||--o{ BOOKMARKS : "stores"

    CATEGORIES ||--o{ BLOGS : "classifies"

    BLOGS ||--o{ BLOG_TAGS : "has"
    TAGS ||--o{ BLOG_TAGS : "applied to"

    BLOGS ||--o{ COMMENTS : "receives"
    BLOGS ||--o{ LIKES : "accumulates"
    BLOGS ||--o{ BOOKMARKS : "saved in"

    USERS {
        bigint id PK
        string username UK
        string email UK
        string password
        string full_name
        text bio
        string avatar_url
        string role
        boolean enabled
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        string name UK
        string slug UK
        string description
        timestamp created_at
    }

    BLOGS {
        bigint id PK
        string title
        string slug UK
        string summary
        text content
        string cover_image_url
        string status
        int views_count
        bigint author_id FK
        bigint category_id FK
        timestamp created_at
        timestamp updated_at
    }

    TAGS {
        bigint id PK
        string name UK
        string slug UK
    }

    BLOG_TAGS {
        bigint blog_id PK,FK
        bigint tag_id PK,FK
    }

    COMMENTS {
        bigint id PK
        text content
        bigint blog_id FK
        bigint user_id FK
        timestamp created_at
    }

    LIKES {
        bigint id PK
        bigint blog_id FK
        bigint user_id FK
        timestamp created_at
    }

    BOOKMARKS {
        bigint id PK
        bigint blog_id FK
        bigint user_id FK
        timestamp created_at
    }

    NEWS {
        bigint id PK
        string title
        string slug UK
        string summary
        text content
        string category_name
        string sub_category_name
        string image_url
        boolean is_breaking
        boolean is_trending
        boolean is_top_story
        string author_name
        int views_count
        timestamp published_at
        timestamp created_at
    }

    EVENTS {
        bigint id PK
        string title
        text description
        string category_name
        string sub_category_name
        string event_date
        string event_time
        string location
        string registration_url
        string status
        string organizer
        string cover_image_url
        timestamp created_at
    }
```

---

## Relational Database Tables Overview

| Table | Primary Key | Foreign Keys | Key Columns |
| :--- | :--- | :--- | :--- |
| **`USERS`** | `id` | - | `username` (UK), `email` (UK), `password`, `role`, `enabled` |
| **`CATEGORIES`** | `id` | - | `name` (UK), `slug` (UK), `description` |
| **`BLOGS`** | `id` | `author_id` &rarr; `USERS(id)`, `category_id` &rarr; `CATEGORIES(id)` | `title`, `slug` (UK), `content`, `status`, `views_count` |
| **`TAGS`** | `id` | - | `name` (UK), `slug` (UK) |
| **`BLOG_TAGS`** | `(blog_id, tag_id)` | `blog_id` &rarr; `BLOGS(id)`, `tag_id` &rarr; `TAGS(id)` | Join table for many-to-many relationship |
| **`COMMENTS`** | `id` | `blog_id` &rarr; `BLOGS(id)`, `user_id` &rarr; `USERS(id)` | `content`, `created_at` |
| **`LIKES`** | `id` | `blog_id` &rarr; `BLOGS(id)`, `user_id` &rarr; `USERS(id)` | Unique index `(blog_id, user_id)` |
| **`BOOKMARKS`** | `id` | `blog_id` &rarr; `BLOGS(id)`, `user_id` &rarr; `USERS(id)` | Unique index `(blog_id, user_id)` |
| **`NEWS`** | `id` | - | `title`, `slug` (UK), `summary`, `is_breaking`, `is_trending` |
| **`EVENTS`** | `id` | - | `title`, `event_date`, `location`, `status`, `registration_url` |

