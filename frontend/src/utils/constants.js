export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const ROLES = {
  USER: 'ROLE_USER',
  AUTHOR: 'ROLE_AUTHOR',
  ADMIN: 'ROLE_ADMIN',
};

export const BLOG_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Software Engineering', slug: 'software-engineering', description: 'Architecture, backend design, clean code, and engineering patterns.' },
  { id: 2, name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Machine learning, LLMs, neural networks, and AI trends.' },
  { id: 3, name: 'Web Development', slug: 'web-development', description: 'Frontend frameworks, React, Vite, CSS, and web applications.' },
  { id: 4, name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'Kubernetes, Docker, CI/CD pipelines, and cloud computing.' },
];
