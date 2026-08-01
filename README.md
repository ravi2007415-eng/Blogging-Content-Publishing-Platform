# Blogging & Content Publishing Platform

A modern, full-stack, enterprise-grade Blogging and Content Publishing Platform built with **Spring Boot 3 (Java 17)** backend and **React (Vite)** frontend.

## 🚀 Features

- 🔐 **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (ROLE_USER, ROLE_AUTHOR, ROLE_ADMIN).
- 📝 **Content Management**: Rich markdown/text editor for creating, updating, publishing, and drafting blog posts.
- 🏷️ **Categorization & Tagging**: Organize posts by hierarchical categories and multi-tag associations.
- 💬 **Interactivity**: Dynamic commenting, post liking, and personalized bookmarking system.
- 🔍 **Search & Discovery**: High-performance full-text search, topic filtering, and popular post recommendations.
- 🛡️ **Admin & Author Dashboards**: Administrative panel for user management, post moderation, and publishing analytics.
- 🎨 **Modern Aesthetic UI**: Vibrant dark/light mode with glassmorphism design tokens, smooth animations, and responsive layout.

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
- **HTTP Client**: Axios with interceptors
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, Micro-animations)
- **State Management**: React Context API

---

## 📁 Directory Structure

```
blogging-content-platform/
├── docs/                 # Documentation & Architecture Diagrams
├── database/             # SQL Schemas, Sample Data & DBML
├── backend/              # Spring Boot Backend API Service
└── frontend/             # React + Vite Frontend Application
```

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- Node.js 18+ and npm

### 1. Database Setup
The application defaults to an H2 in-memory database with pre-loaded sample data. To use MySQL, configure `backend/src/main/resources/application-prod.properties` and update your database URL and credentials.

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend API will start at `http://localhost:8080/api/v1`.
Swagger UI will be available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend web application will start at `http://localhost:5173`.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
