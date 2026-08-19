-- =========================================================
-- Sample Data for Blogging & Content Publishing Platform
-- Passwords are hashed BCrypt string for 'password123'
-- =========================================================

-- Insert Users
INSERT INTO users (id, username, email, password, full_name, bio, avatar_url, role, enabled) VALUES
(1, 'admin', 'admin@blogplatform.com', '$2a$10$e7xGZ7XJvj1LhYvT9V5SVeU7G3dZ6K0N1Q5R9P5SVeU7G3dZ6K0N1', 'Platform Administrator', 'Managing platform operations, users, and quality control.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ROLE_ADMIN', TRUE),
(2, 'tech_guru', 'author@blogplatform.com', '$2a$10$e7xGZ7XJvj1LhYvT9V5SVeU7G3dZ6K0N1Q5R9P5SVeU7G3dZ6K0N1', 'Alex Mercer', 'Senior Staff Software Engineer & AI Researcher writing on distributed systems and cloud native tech.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ROLE_AUTHOR', TRUE),
(3, 'jane_dev', 'jane@example.com', '$2a$10$e7xGZ7XJvj1LhYvT9V5SVeU7G3dZ6K0N1Q5R9P5SVeU7G3dZ6K0N1', 'Jane Doe', 'Full Stack Developer, UI/UX enthusiast, and tech reviewer.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'ROLE_USER', TRUE);

-- Insert Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Software Engineering', 'software-engineering', 'Architecture, backend design, clean code, and engineering patterns.'),
(2, 'Artificial Intelligence', 'artificial-intelligence', 'Machine learning, Large Language Models, neural networks, and AI trends.'),
(3, 'Web Development', 'web-development', 'Frontend frameworks, React, Vite, CSS, and modern web applications.'),
(4, 'DevOps & Cloud', 'devops-cloud', 'Kubernetes, Docker, CI/CD pipelines, and cloud computing best practices.');

-- Insert Tags
INSERT INTO tags (id, name, slug) VALUES
(1, 'Java', 'java'),
(2, 'Spring Boot', 'spring-boot'),
(3, 'React', 'react'),
(4, 'Vite', 'vite'),
(5, 'AI', 'ai'),
(6, 'Microservices', 'microservices');

-- Insert Blogs
INSERT INTO blogs (id, title, slug, summary, content, cover_image_url, status, views_count, author_id, category_id) VALUES
(1, 'Building Scalable Microservices with Spring Boot 3 & Java 17', 'building-scalable-microservices-spring-boot-3', 'Explore modern enterprise architecture patterns using Spring Boot 3, Spring Cloud Gateway, and Resilience4j for resilient distributed systems.', '## Introduction\nMicroservice architecture has become the standard for building enterprise-grade applications. Spring Boot 3 brings first-class support for GraalVM native images, virtual threads, and enhanced observability.\n\n### Key Principles\n1. **Decoupled Persistence**: Each service owns its database.\n2. **Resilience**: Implement circuit breakers and rate limiters.\n3. **Centralized Auth**: Use JWT and API Gateways for request validation.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', 'PUBLISHED', 1240, 2, 1),
(2, 'Designing Futuristic Glassmorphic UIs with Modern Vanilla CSS', 'designing-futuristic-glassmorphic-uis-modern-css', 'Learn how to harness CSS backdrop-filter, custom properties, and micro-interactions to create breathtaking, high-end web interfaces.', '## The Evolution of Glassmorphism\nGlassmorphism combines frosted glass transparency, dynamic light glows, and multi-layered depth effects to create interfaces that feel alive.\n\n### CSS Implementation\n```css\n.glass-card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n```', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 'PUBLISHED', 890, 2, 3),
(3, 'The Rise of Agentic AI: Autonomous Systems Transforming Software Development', 'the-rise-of-agentic-ai-transforming-software', 'An in-depth analysis of autonomous AI agents, tool-augmented reasoning, and their impact on modern software development workflows.', '## Understanding Agentic AI\nUnlike static LLMs that simply return text responses, Agentic AI systems can reason in loops, plan complex tasks, invoke APIs, execute code, and self-correct based on empirical feedback.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800', 'PUBLISHED', 1560, 2, 2);

-- Insert Blog Tags
INSERT INTO blog_tags (blog_id, tag_id) VALUES
(1, 1), (1, 2), (1, 6),
(2, 3), (2, 4),
(3, 5);

-- Insert Comments
INSERT INTO comments (id, content, blog_id, user_id) VALUES
(1, 'Fantastic breakdown of Spring Boot 3 virtual threads and microservice resiliency!', 1, 3),
(2, 'The glassmorphism CSS examples are super sleek. Implementing this in my portfolio!', 2, 3);

-- Insert Likes
INSERT INTO likes (id, blog_id, user_id) VALUES
(1, 1, 3),
(2, 2, 3),
(3, 3, 3);

-- Insert Bookmarks
INSERT INTO bookmarks (id, blog_id, user_id) VALUES
(1, 1, 3),
(2, 3, 3);
