export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'https://blogging-content-publishing-platform-production.up.railway.app/api/v1';

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
  { id: 1, name: 'Technology', slug: 'technology', description: 'Systems architecture, software, hardware, and cybersecurity.' },
  { id: 2, name: 'AI & Machine Learning', slug: 'ai-ml', description: 'Generative AI, Large Language Models, deep learning, and AI agents.' },
  { id: 3, name: 'Programming', slug: 'programming', description: 'Languages, design patterns, clean code, and developer tooling.' },
  { id: 4, name: 'Web Development', slug: 'web-development', description: 'Frontend frameworks, React, Vite, modern CSS, and web apps.' },
  { id: 5, name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'Kubernetes, Docker, CI/CD pipelines, and cloud computing.' },
  { id: 6, name: 'Education', slug: 'education', description: 'Learning techniques, student success guides, and research.' },
  { id: 7, name: 'Business', slug: 'business', description: 'Startups, venture capital, enterprise strategy, and SaaS.' },
  { id: 8, name: 'Finance', slug: 'finance', description: 'FinTech, markets, investing, and digital banking.' },
  { id: 9, name: 'Travel', slug: 'travel', description: 'Digital nomad destinations, culture guides, and adventure travel.' },
  { id: 10, name: 'Lifestyle', slug: 'lifestyle', description: 'Productivity, mental well-being, habits, and focus.' },
  { id: 11, name: 'Science', slug: 'science', description: 'Quantum computing, space exploration, and clean energy.' },
  { id: 12, name: 'Sports', slug: 'sports', description: 'Athletic analysis, sports analytics, and major tournaments.' },
  { id: 13, name: 'Entertainment', slug: 'entertainment', description: 'Cinema, music technology, and digital storytelling.' },
  { id: 14, name: 'Cars', slug: 'cars', description: 'Electric vehicles, autonomous driving, and automotive tech.' },
  { id: 15, name: 'Gaming', slug: 'gaming', description: 'Game design, esports, graphics engines, and indie games.' }
];
