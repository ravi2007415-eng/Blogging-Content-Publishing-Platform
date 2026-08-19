# Changelog

All notable changes to the Blogging & Content Publishing Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

### Added
- **Backend Architecture**: Spring Boot 3 REST API foundation with Layered Architecture.
- **Authentication**: JWT authentication with Spring Security 6, custom filters, and BCrypt password encryption.
- **Role-Based Access Control**: Standardized permissions for `ROLE_USER`, `ROLE_AUTHOR`, and `ROLE_ADMIN`.
- **Domain Entities & Repositories**: Complete JPA models for Users, Blogs, Categories, Tags, Comments, Likes, and Bookmarks.
- **Frontend Architecture**: React 18 SPA powered by Vite, featuring a futuristic glassmorphic UI design system.
- **Interactive Features**: Dynamic commenting, article liking, bookmarking, multi-tag filtering, and keyword search.
- **Dashboards**: Admin and Author analytical control centers for content and user management.
- **Database & Specs**: Complete DBML schema, standard SQL migrations (`schema.sql`, `sample_data.sql`), and OpenAPI documentation.
