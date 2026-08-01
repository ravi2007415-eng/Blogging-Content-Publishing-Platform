# API Endpoint Specifications

Base URL: `/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account | Public |
| `POST` | `/auth/login` | Authenticate credentials & return JWT | Public |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | User / Author / Admin |

---

## 2. Blog Endpoints (`/blogs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs` | Get paginated list of published blogs | Public |
| `GET` | `/blogs/{id}` | Get blog by ID (increments view count) | Public |
| `GET` | `/blogs/slug/{slug}` | Get blog by unique slug | Public |
| `POST` | `/blogs` | Create a new blog post (Draft or Published) | Author / Admin |
| `PUT` | `/blogs/{id}` | Update existing blog post | Author (Owner) / Admin |
| `DELETE` | `/blogs/{id}` | Delete blog post | Author (Owner) / Admin |
| `GET` | `/blogs/my-blogs` | List blogs created by authenticated author | Author / Admin |

---

## 3. Category Endpoints (`/categories`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | List all blog categories | Public |
| `GET` | `/categories/{id}` | Get category details by ID | Public |
| `POST` | `/categories` | Create new category | Admin |
| `PUT` | `/categories/{id}` | Update existing category | Admin |
| `DELETE` | `/categories/{id}` | Delete category | Admin |

---

## 4. Tag Endpoints (`/tags`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/tags` | List all tags | Public |
| `POST` | `/tags` | Create new tag | Author / Admin |

---

## 5. Comment Endpoints (`/comments`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs/{blogId}/comments` | Get all comments for a blog | Public |
| `POST` | `/blogs/{blogId}/comments` | Add comment to a blog | Authenticated User |
| `DELETE` | `/comments/{commentId}` | Delete comment | Author/Owner/Admin |

---

## 6. Like & Bookmark Endpoints (`/likes`, `/bookmarks`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/blogs/{blogId}/like` | Toggle like for a blog | Authenticated User |
| `GET` | `/blogs/{blogId}/like-count` | Get total likes count | Public |
| `POST` | `/blogs/{blogId}/bookmark` | Toggle bookmark status | Authenticated User |
| `GET` | `/bookmarks/my-bookmarks` | List bookmarked blogs for user | Authenticated User |

---

## 7. Search Endpoints (`/search`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/search?q={query}` | Search blogs by title, content, or summary | Public |
| `GET` | `/search/category/{slug}` | Filter published blogs by category slug | Public |
| `GET` | `/search/tag/{slug}` | Filter published blogs by tag slug | Public |

---

## 8. Admin Endpoints (`/admin`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Platform dashboard metrics & analytics | Admin |
| `GET` | `/admin/users` | List all platform users | Admin |
| `PUT` | `/admin/users/{userId}/role` | Change user role (USER, AUTHOR, ADMIN) | Admin |
| `DELETE` | `/admin/users/{userId}` | Delete user account | Admin |
