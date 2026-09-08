# 🎓 Blogging & Content Publishing Platform

[![Java 17](https://img.shields.io/badge/Java-17-orange.svg?style=flat-square&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-blue.svg?style=flat-square&logo=springsecurity)](https://spring.io/projects/spring-security)
[![React 18](https://img.shields.io/badge/React-18.x-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg?style=flat-square&logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A modern, full-stack, enterprise-grade Blogging and Content Publishing Platform built using **Spring Boot 3 (Java 17)** backend and **React (Vite)** frontend. It streamlines digital content creation by featuring JWT-based security with Role-Based Access Control (RBAC), AI-powered blog summarization, interactive reader engagement (comments, likes, bookmarks), categorized content discovery, and comprehensive admin moderation tools.

---

## 🏛️ System Architecture

The application is architected around a decoupled, layered micro-monolith backend deployed on **Render** and a modern Single Page Application (SPA) frontend deployed on **Vercel**.

```mermaid
graph TB
    %% Users
    Admin["👨‍💼 Admin"]
    Author["✍️ Author"]
    Reader["📖 Reader"]

    %% Client Layer
    subgraph ClientLayer["🖥️ Client Layer (Browser)"]
        Frontend["React.js + Vite<br/>Bootstrap / Modern CSS<br/>Axios HTTP Client<br/>JWT Authentication"]
    end

    Admin --> Frontend
    Author --> Frontend
    Reader --> Frontend

    %% Hosting
    subgraph Hosting["☁️ Hosting"]
        Vercel["▲ Vercel (Frontend)"]
        Render["⚡ Render (Backend)"]
    end

    Frontend -. "Hosted On" .-> Vercel
    
    %% Backend Layer
    subgraph BackendLayer["⚙️ Backend / API Layer (Render)"]
        
        subgraph ExternalServices["🌐 External Services"]
            SMTP["📧 SMTP Email Service"]
            OpenAI["🤖 OpenAI API<br/>(AI Blog Summary)"]
            Cloudinary["🖼️ Cloudinary<br/>(Image Storage)"]
        end

        Swagger["📄 Swagger / OpenAPI"]

        subgraph CoreBackend["Core Spring Application"]
            REST["🚀 Spring Boot 3 REST API"]
            Security["🔐 Spring Security + JWT"]
            JPA["📦 Spring Data JPA"]
            
            REST --> Security
            Security --> JPA
        end

        REST -.-> SMTP
        REST -.-> OpenAI
        REST -.-> Cloudinary
    end

    Frontend -- "HTTPS / JSON (REST)" --> REST
    CoreBackend -. "Hosted On" .-> Render

    %% Database Layer
    subgraph DatabaseLayer["💾 Database Layer"]
        MySQL[("🛢️ MySQL Database")]
        
        Bookmarks[("Bookmarks")]
        Likes[("Likes")]
        Comments[("Comments")]
        BlogTags[("BlogTags")]
        Tags[("Tags")]
        Categories[("Categories")]
        Blogs[("Blogs")]
        Users[("Users")]

        MySQL --- Bookmarks
        MySQL --- Likes
        MySQL --- Comments
        MySQL --- BlogTags
        MySQL --- Tags
        MySQL --- Categories
        MySQL --- Blogs
        MySQL --- Users
    end

    JPA --> MySQL
```

> 📖 *For in-depth architectural details and security flows, check the [System Architecture Guide](docs/architecture.md).*

---

## 🗄️ Database Entity-Relationship (ER) Diagram

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
        VARCHAR username UK "Unique"
        VARCHAR email UK "Unique"
        VARCHAR password "BCrypt Hash"
        VARCHAR full_name
        TEXT bio
        VARCHAR avatar_url
        VARCHAR role "ROLE_USER | ROLE_AUTHOR | ROLE_ADMIN"
        BOOLEAN enabled
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CATEGORIES {
        BIGINT id PK "Auto Increment"
        VARCHAR name UK
        VARCHAR slug UK
        VARCHAR description
        TIMESTAMP created_at
    }

    BLOGS {
        BIGINT id PK "Auto Increment"
        VARCHAR title
        VARCHAR slug UK
        VARCHAR summary
        LONGTEXT content
        VARCHAR cover_image_url
        VARCHAR status "DRAFT | PUBLISHED | ARCHIVED"
        INT views_count
        BIGINT author_id FK
        BIGINT category_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    TAGS {
        BIGINT id PK "Auto Increment"
        VARCHAR name UK
        VARCHAR slug UK
    }

    BLOG_TAGS {
        BIGINT blog_id PK,FK
        BIGINT tag_id PK,FK
    }

    COMMENTS {
        BIGINT id PK "Auto Increment"
        TEXT content
        BIGINT blog_id FK
        BIGINT user_id FK
        TIMESTAMP created_at
    }

    LIKES {
        BIGINT id PK "Auto Increment"
        BIGINT blog_id FK
        BIGINT user_id FK
        TIMESTAMP created_at
    }

    BOOKMARKS {
        BIGINT id PK "Auto Increment"
        BIGINT blog_id FK
        BIGINT user_id FK
        TIMESTAMP created_at
    }
```

> 📖 *For complete table schemas, SQL scripts, and data dictionaries, view [docs/er_diagram.md](docs/er_diagram.md) and [database/schema.sql](database/schema.sql).*

---

## 🚀 Key Features

- 🔐 **Authentication & Authorization**: Stateless JWT security with Role-Based Access Control (`ROLE_USER`, `ROLE_AUTHOR`, `ROLE_ADMIN`).
- 📝 **Content Management**: Rich Markdown / Text editor to compose, save drafts, preview, publish, edit, and archive articles.
- 🏷️ **Categorization & Multi-Tagging**: Organize articles into hierarchical categories and multi-tag taxonomy.
- 🤖 **AI Summary & Cloud Media**: OpenAI integration for automatic blog summaries and Cloudinary for image asset management.
- 💬 **User Engagement**: Interactive comments, post liking, and personal bookmarking reading list.
- 🔍 **Search & Discovery**: High-performance full-text search, topic filtering, and popular post recommendations.
- 🛡️ **Admin & Moderation Dashboards**: Administrative panel for user role management, post moderation, and publishing analytics.
- 🎨 **Modern Responsive UI**: Dark/Light mode support with glassmorphism UI tokens, micro-animations, and fluid layout.

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security 6 with JWT
- **ORM / Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.0 (Production) / H2 In-Memory (Dev/Test)
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Styling**: Bootstrap / Vanilla CSS (CSS Variables, Flexbox/Grid, Dark/Light theme)
- **State Management**: React Context API (`AuthContext`, `UserContext`)

### External Services & Hosting
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **AI Blog Summarization**: OpenAI API
- **Media CDN**: Cloudinary
- **Notifications**: SMTP Email Service

---

## 📁 Directory Structure

```
blogging-content-platform/
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── Problem_Statement.md
├── README.md
│
├── docs/
│   ├── api_endpoints.md                      # REST API Documentation
│   ├── architecture.md                       # System Architecture & Flow Specs
│   ├── er_diagram.md                         # Database Schema & ER Diagram Specs
│   └── requirements.md                       # Functional & Non-functional Specs
│
├── database/
│   ├── schema.sql                            # DDL Table Schemas & Constraints
│   └── sample_data.sql                       # Seed Data for Initial Setup
│
├── backend/                                  # Spring Boot REST API
│   ├── .env.example
│   ├── pom.xml                               # Maven Build Configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/blog/platform/
│       │   │   ├── BloggingPlatformApplication.java
│       │   │   ├── config/                   # Security, CORS, Swagger Config
│       │   │   ├── controller/               # REST API Controllers
│       │   │   ├── dto/                      # Request & Response DTOs
│       │   │   ├── exception/                # Global Exception Handler
│       │   │   ├── model/
│       │   │   │   ├── entity/               # JPA Entities (User, Blog, etc.)
│       │   │   │   └── enums/                # Role, BlogStatus
│       │   │   ├── repository/               # Spring Data JPA Repositories
│       │   │   ├── service/                  # Business Logic Services
│       │   │   └── util/                     # JWT & File Utilities
│       │   │
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-dev.properties
│       │       ├── application-prod.properties
│       │       └── data.sql
│       │
│       └── test/
│
└── frontend/                                 # React 18 + Vite SPA
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    │
    ├── public/
    └── src/
        ├── api/                              # Axios API Clients
        ├── assets/                           # Static Assets & Icons
        ├── components/                       # Reusable UI Components
        ├── context/                          # AuthContext, UserContext
        ├── hooks/                            # Custom React Hooks
        ├── pages/                            # Application Views
        ├── routes/                           # Route Definitions
        ├── styles/                           # Global CSS & Design Tokens
        └── utils/                            # Helper Functions & Constants
```

---

## 🚀 Getting Started

### Prerequisites
- **JDK 17** or higher installed
- **Maven 3.8+** installed
- **Node.js 18+** and **npm** installed
- **MySQL 8.0+** (Optional for local development, H2 in-memory is active by default in dev mode)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and build
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

- Backend API: `http://localhost:8080/api/v1`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/v3/api-docs`

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

- Frontend Application: `http://localhost:5173`

---

## 📡 REST API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate & receive JWT token | Public |
| `GET` | `/api/v1/blogs` | Get paginated published blogs | Public |
| `GET` | `/api/v1/blogs/{slug}` | Get blog details by slug | Public |
| `POST` | `/api/v1/blogs` | Create a new blog post | Author / Admin |
| `PUT` | `/api/v1/blogs/{id}` | Update existing blog post | Author / Admin |
| `DELETE` | `/api/v1/blogs/{id}` | Delete blog post | Author / Admin |
| `GET` | `/api/v1/categories` | List all categories | Public |
| `POST` | `/api/v1/categories` | Create a new category | Admin |
| `GET` | `/api/v1/tags` | List all tags | Public |
| `POST` | `/api/v1/blogs/{id}/comments` | Add comment to a blog | Authenticated |
| `POST` | `/api/v1/blogs/{id}/like` | Toggle like status on a blog | Authenticated |
| `POST` | `/api/v1/blogs/{id}/bookmark` | Toggle bookmark on a blog | Authenticated |
| `GET` | `/api/v1/search` | Search articles by keyword/tag | Public |
| `GET` | `/api/v1/admin/stats` | View platform statistics & metrics | Admin |

> 📖 *For complete request and response schemas, see [docs/api_endpoints.md](docs/api_endpoints.md).*

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
