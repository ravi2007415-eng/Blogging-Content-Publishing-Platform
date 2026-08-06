# 🎓 Blogging & Content Publishing Platform

A modern, full-stack, enterprise-grade Blogging and Content Publishing Platform built using **Spring Boot 3 (Java 17)** backend and **React (Vite)** frontend. It streamlines digital content creation by featuring JWT-based security with Role-Based Access Control (RBAC), interactive reader engagement (comments, likes, bookmarks), categorized content discovery, and comprehensive admin moderation tools.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client Tier
        UI["React SPA (Vite + Vanilla CSS)"]
        Router["React Router v6"]
        Axios["Axios Client + JWT Interceptors"]
    end

    subgraph API Gateway / Security Layer
        CORS["CORS Configuration"]
        SecFilter["Spring Security Filter Chain"]
        JWTFilter["JwtAuthenticationFilter"]
    end

    subgraph Controller Layer
        AuthCtrl["AuthController"]
        BlogCtrl["BlogController"]
        UserCtrl["UserController"]
        AdminCtrl["AdminController"]
    end

    subgraph Service Layer
        AuthSvc["AuthServiceImpl"]
        BlogSvc["BlogServiceImpl"]
        UserSvc["UserServiceImpl"]
        AdminSvc["AdminServiceImpl"]
    end

    subgraph Data Access Layer
        UserRepo["UserRepository"]
        BlogRepo["BlogRepository"]
        CommentRepo["CommentRepository"]
    end

    subgraph Database Tier
        DB[("H2 / MySQL Database")]
    end

    UI --> Router
    Router --> Axios
    Axios -->|HTTP Requests / Bearer JWT| CORS
    CORS --> SecFilter
    SecFilter --> JWTFilter
    JWTFilter --> AuthCtrl & BlogCtrl & UserCtrl & AdminCtrl

    AuthCtrl --> AuthSvc
    BlogCtrl --> BlogSvc
    UserCtrl --> UserSvc
    AdminCtrl --> AdminSvc

    AuthSvc --> UserRepo
    BlogSvc --> BlogRepo & CommentRepo
    UserSvc --> UserRepo
    AdminSvc --> UserRepo & BlogRepo

    UserRepo --> DB
    BlogRepo --> DB
    CommentRepo --> DB
```

---

## 🗄️ Entity-Relationship (ER) Diagram

```mermaid
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
        string role
    }

    CATEGORIES {
        bigint id PK
        string name UK
        string slug UK
    }

    BLOGS {
        bigint id PK
        string title
        string slug UK
        text content
        string status
        bigint author_id FK
        bigint category_id FK
    }

    TAGS {
        bigint id PK
        string name UK
        string slug UK
    }

    COMMENTS {
        bigint id PK
        text content
        bigint blog_id FK
        bigint user_id FK
    }
```

---

## 🏛️ Class Diagram

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
    }

    class Bookmark {
        +Long id
        +Blog blog
        +User user
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

## 🚀 Key Features

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication with Role-Based Access Control (`ROLE_USER`, `ROLE_AUTHOR`, `ROLE_ADMIN`).
- 📝 **Content Management**: Rich Markdown / Text editor to compose, save drafts, publish, edit, and delete blog posts.
- 🏷️ **Categorization & Multi-Tagging**: Organize articles into hierarchical categories and multi-tag taxonomy.
- 💬 **User Engagement**: Interactive comments, post liking, and personal bookmarking system.
- 🔍 **Search & Discovery**: High-performance full-text search, topic filtering, and popular post recommendations.
- 🛡️ **Admin & Moderation Dashboards**: Administrative panel for user role management, post moderation, and publishing analytics.
- 🎨 **Modern Responsive UI**: Dark/Light mode support with glassmorphism UI tokens, micro-animations, and fluid layout.

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security 6 with JWT
- **Database**: H2 (In-memory for Dev) / MySQL 8.0 (Production)
- **ORM**: Spring Data JPA / Hibernate
- **Documentation**: OpenAPI 3.0 / Swagger UI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, Micro-animations)
- **State Management**: React Context API

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
│   ├── architecture_diagram.png
│   ├── class_diagram.png
│   ├── er_diagram.png
│   ├── schema.dbml                           # Source DBML schema for dbdiagram.io
│   ├── diagrams/
│   │   ├── architecture.md                   # System Architecture Documentation
│   │   ├── class_diagram.md                  # UML Class Diagram Documentation
│   │   ├── er_diagram.md                     # ER Diagram Documentation
│   │   └── schema.dbml
│   └── screenshots/
│       ├── login_page.png
│       ├── register_page.png
│       ├── home_page.png
│       ├── dashboard.png
│       ├── create_blog.png
│       ├── blog_details.png
│       └── admin_dashboard.png
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   └── schema.dbml
│
├── backend/                                  # Java 17 + Spring Boot REST API
│   ├── .env.example
│   ├── pom.xml                               # Maven Build Configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/bloggingplatform/
│       │   │   ├── BloggingPlatformApplication.java
│       │   │
│       │   │   ├── config/                   # Security & Configuration
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   ├── JwtFilter.java
│       │   │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── SwaggerConfig.java
│       │   │
│       │   │   ├── controller/               # REST Controllers
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── UserController.java
│       │   │   │   ├── BlogController.java
│       │   │   │   ├── CategoryController.java
│       │   │   │   ├── TagController.java
│       │   │   │   ├── CommentController.java
│       │   │   │   ├── LikeController.java
│       │   │   │   ├── BookmarkController.java
│       │   │   │   ├── SearchController.java
│       │   │   │   └── AdminController.java
│       │   │
│       │   │   ├── service/                  # Service Interfaces
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── UserService.java
│       │   │   │   ├── BlogService.java
│       │   │   │   ├── CategoryService.java
│       │   │   │   ├── TagService.java
│       │   │   │   ├── BlogTagService.java
│       │   │   │   ├── CommentService.java
│       │   │   │   ├── LikeService.java
│       │   │   │   ├── BookmarkService.java
│       │   │   │   ├── SearchService.java
│       │   │   │   └── AdminService.java
│       │   │
│       │   │   ├── service/impl/             # Service Implementations
│       │   │   │   ├── AuthServiceImpl.java
│       │   │   │   ├── UserServiceImpl.java
│       │   │   │   ├── BlogServiceImpl.java
│       │   │   │   ├── CategoryServiceImpl.java
│       │   │   │   ├── TagServiceImpl.java
│       │   │   │   ├── BlogTagServiceImpl.java
│       │   │   │   ├── CommentServiceImpl.java
│       │   │   │   ├── LikeServiceImpl.java
│       │   │   │   ├── BookmarkServiceImpl.java
│       │   │   │   ├── SearchServiceImpl.java
│       │   │   │   └── AdminServiceImpl.java
│       │   │
│       │   │   ├── repository/               # Spring Data JPA Repositories
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── BlogRepository.java
│       │   │   │   ├── CategoryRepository.java
│       │   │   │   ├── TagRepository.java
│       │   │   │   ├── BlogTagRepository.java
│       │   │   │   ├── CommentRepository.java
│       │   │   │   ├── LikeRepository.java
│       │   │   │   └── BookmarkRepository.java
│       │   │
│       │   │   ├── model/
│       │   │   │   ├── entity/               # JPA Entities
│       │   │   │   │   ├── User.java
│       │   │   │   │   ├── Blog.java
│       │   │   │   │   ├── Category.java
│       │   │   │   │   ├── Tag.java
│       │   │   │   │   ├── BlogTag.java
│       │   │   │   │   ├── Comment.java
│       │   │   │   │   ├── Like.java
│       │   │   │   │   └── Bookmark.java
│       │   │   │   │
│       │   │   │   └── enums/
│       │   │   │       ├── Role.java
│       │   │   │       └── BlogStatus.java
│       │   │
│       │   │   ├── dto/                      # Request & Response DTOs
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── LoginResponse.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   ├── UserResponse.java
│       │   │   │   ├── BlogRequest.java
│       │   │   │   ├── BlogResponse.java
│       │   │   │   ├── CategoryRequest.java
│       │   │   │   ├── TagRequest.java
│       │   │   │   ├── CommentRequest.java
│       │   │   │   └── BookmarkResponse.java
│       │   │
│       │   │   ├── exception/                # Custom Exceptions
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   ├── UnauthorizedException.java
│       │   │   │   ├── DuplicateResourceException.java
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │
│       │   │   └── util/                     # Utility Classes
│       │   │       ├── JwtUtil.java
│       │   │       ├── ValidationUtil.java
│       │   │       └── FileUploadUtil.java
│       │   │
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-dev.properties
│       │       ├── application-prod.properties
│       │       ├── data.sql                  # Initial Seed Data
│       │       └── static/
│       │           └── uploads/
│       │               └── blog-images/
│       │
│       └── test/
│           └── java/com/bloggingplatform/
│               ├── BloggingPlatformApplicationTests.java
│               ├── BlogServiceTest.java
│               └── AuthControllerTest.java
│
└── frontend/                                 # React 18 + Vite Frontend
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
│
    ├── public/
    │   ├── logo.png
    │   ├── favicon.ico
    │   └── default-avatar.png
│
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
│
        ├── api/                              # Axios Services
        │   ├── axiosConfig.js
        │   ├── authApi.js
        │   ├── blogApi.js
        │   ├── categoryApi.js
        │   ├── commentApi.js
        │   ├── bookmarkApi.js
        │   └── likeApi.js
│
        ├── assets/
        │   ├── images/
        │   └── icons/
│
        ├── components/                       # Reusable Components
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── Footer.jsx
        │   ├── BlogCard.jsx
        │   ├── SearchBar.jsx
        │   ├── CategoryCard.jsx
        │   ├── Loader.jsx
        │   ├── ProtectedRoute.jsx
        │   └── RichTextEditor.jsx
│
        ├── context/                          # React Context
        │   ├── AuthContext.jsx
        │   └── UserContext.jsx
│
        ├── hooks/
        │   ├── useAuth.js
        │   └── useFetch.js
│
        ├── pages/                            # Application Pages
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── CreateBlog.jsx
        │   ├── EditBlog.jsx
        │   ├── BlogDetails.jsx
        │   ├── Categories.jsx
        │   ├── Search.jsx
        │   ├── Profile.jsx
        │   ├── Bookmarks.jsx
        │   ├── AdminDashboard.jsx
        │   ├── ManageBlogs.jsx
        │   ├── ManageUsers.jsx
        │   └── NotFound.jsx
│
        ├── routes/
        │   └── AppRoutes.jsx
│
        └── utils/
            ├── constants.js
            ├── helpers.js
            ├── validators.js
            └── storage.js
```

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend API will start at `http://localhost:8080/api/v1`.  
Swagger UI will be available at `http://localhost:8080/swagger-ui.html`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend web application will start at `http://localhost:5173`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
