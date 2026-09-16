export const INITIAL_TAXONOMY = [
  {
    id: 1,
    name: 'Technology',
    slug: 'technology',
    icon: 'Cpu',
    description: 'Hardware, software architecture, emerging tech trends, and cybersecurity.',
    subCategories: [
      { id: 101, name: 'Cybersecurity', slug: 'cybersecurity', description: 'Zero trust, network security, cryptography, and defense.' },
      { id: 102, name: 'Hardware & Chips', slug: 'hardware-chips', description: 'Semiconductors, processors, and computer architecture.' },
      { id: 103, name: 'Internet & Networking', slug: 'internet-networking', description: 'Protocols, infrastructure, and telecommunications.' }
    ]
  },
  {
    id: 2,
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    icon: 'Sparkles',
    description: 'Generative AI, Large Language Models, deep learning, and intelligent agents.',
    subCategories: [
      { id: 201, name: 'LLMs & GenAI', slug: 'llms-genai', description: 'Transformer models, prompt engineering, and agent systems.' },
      { id: 202, name: 'Computer Vision', slug: 'computer-vision', description: 'Image recognition, spatial computing, and video processing.' },
      { id: 203, name: 'MLOps', slug: 'mlops', description: 'Model deployment, pipeline automation, and monitoring.' }
    ]
  },
  {
    id: 3,
    name: 'Programming',
    slug: 'programming',
    icon: 'Code2',
    description: 'Languages, design patterns, clean code, and developer tooling.',
    subCategories: [
      { id: 301, name: 'Java & Spring', slug: 'java-spring', description: 'Enterprise backend development, JVM internals, Spring ecosystem.' },
      { id: 302, name: 'Python', slug: 'python', description: 'Data science, automation, backend APIs with FastAPI/Django.' },
      { id: 303, name: 'Rust & Systems', slug: 'rust-systems', description: 'Memory-safe systems programming, performance engineering.' },
      { id: 304, name: 'TypeScript & JavaScript', slug: 'typescript-javascript', description: 'Full-stack JS, Node.js runtimes, and typing best practices.' }
    ]
  },
  {
    id: 4,
    name: 'Web Development',
    slug: 'web-development',
    icon: 'Globe',
    description: 'Frontend frameworks, responsive UI, CSS architecture, and web performance.',
    subCategories: [
      { id: 401, name: 'React Ecosystem', slug: 'react-ecosystem', description: 'React 18/19, hooks, state management, and server components.' },
      { id: 402, name: 'Modern CSS & Styling', slug: 'modern-css', description: 'Design systems, tokens, glassmorphism, responsive layouts.' },
      { id: 403, name: 'Full-Stack Frameworks', slug: 'full-stack-frameworks', description: 'Next.js, Remix, Astro, and Vite build tooling.' }
    ]
  },
  {
    id: 5,
    name: 'Cloud & DevOps',
    slug: 'cloud-devops',
    icon: 'Cloud',
    description: 'Container orchestration, CI/CD pipelines, cloud platforms, and site reliability.',
    subCategories: [
      { id: 501, name: 'Kubernetes & Docker', slug: 'kubernetes-docker', description: 'Containerization, microservice deployment, cluster scaling.' },
      { id: 502, name: 'CI/CD & Automation', slug: 'cicd-automation', description: 'GitHub Actions, Jenkins, automated testing, release pipelines.' },
      { id: 503, name: 'AWS & GCP', slug: 'aws-gcp', description: 'Cloud architecture, serverless, and cloud database optimization.' }
    ]
  },
  {
    id: 6,
    name: 'Education',
    slug: 'education',
    icon: 'GraduationCap',
    description: 'Learning techniques, student success guides, academic research, and online education.',
    subCategories: [
      { id: 601, name: 'Learning Strategies', slug: 'learning-strategies', description: 'Spaced repetition, deep work, active recall, and study systems.' },
      { id: 602, name: 'Student Career Guides', slug: 'student-career-guides', description: 'Internships, resumes, technical interviews, and portfolio projects.' },
      { id: 603, name: 'Online Courses & MOOCs', slug: 'online-courses', description: 'Self-taught developer journeys and curriculum recommendations.' }
    ]
  },
  {
    id: 7,
    name: 'Business',
    slug: 'business',
    icon: 'Briefcase',
    description: 'Startups, venture capital, enterprise leadership, and digital transformation.',
    subCategories: [
      { id: 701, name: 'Startups & SaaS', slug: 'startups-saas', description: 'Product-market fit, fundraising, bootstrapping, and scaling.' },
      { id: 702, name: 'Product Management', slug: 'product-management', description: 'Roadmapping, UX research, OKRs, and agile methodology.' },
      { id: 703, name: 'Strategy & Leadership', slug: 'strategy-leadership', description: 'Organizational culture, team scaling, and executive decision-making.' }
    ]
  },
  {
    id: 8,
    name: 'Finance',
    slug: 'finance',
    icon: 'DollarSign',
    description: 'FinTech, markets, algorithmic trading, personal wealth, and decentralized finance.',
    subCategories: [
      { id: 801, name: 'FinTech & Payments', slug: 'fintech-payments', description: 'Digital banking, Stripe integration, open banking protocols.' },
      { id: 802, name: 'Personal Investing', slug: 'personal-investing', description: 'Index funds, long-term wealth, and portfolio diversification.' },
      { id: 803, name: 'Markets & Macro', slug: 'markets-macro', description: 'Economic indicators, interest rates, and market analysis.' }
    ]
  },
  {
    id: 9,
    name: 'Travel',
    slug: 'travel',
    icon: 'Compass',
    description: 'Digital nomad destinations, cultural guides, budget travel, and global exploration.',
    subCategories: [
      { id: 901, name: 'Digital Nomad Hubs', slug: 'digital-nomad-hubs', description: 'Remote work cities, visas, coworking, and expat lifestyle.' },
      { id: 902, name: 'Adventure Travel', slug: 'adventure-travel', description: 'Hiking, wilderness exploration, and off-the-beaten-path routes.' }
    ]
  },
  {
    id: 10,
    name: 'Lifestyle',
    slug: 'lifestyle',
    icon: 'Heart',
    description: 'Productivity, mental well-being, habit formation, and work-life harmony.',
    subCategories: [
      { id: 1001, name: 'Productivity & Habits', slug: 'productivity-habits', description: 'Time blocking, habit tracking, minimalism, and focus.' },
      { id: 1002, name: 'Health & Wellness', slug: 'health-wellness', description: 'Ergonomics, mindfulness for developers, and longevity.' }
    ]
  },
  {
    id: 11,
    name: 'Science',
    slug: 'science',
    icon: 'Atom',
    description: 'Quantum computing, astrophysics, renewable energy, and biological breakthroughs.',
    subCategories: [
      { id: 1101, name: 'Quantum Physics', slug: 'quantum-physics', description: 'Qubits, quantum entanglement, and supercomputing.' },
      { id: 1102, name: 'Space Exploration', slug: 'space-exploration', description: 'Mars missions, satellite constellations, and astronomy.' },
      { id: 1103, name: 'Clean Energy', slug: 'clean-energy', description: 'Solar, fusion research, battery chemistry, and green tech.' }
    ]
  },
  {
    id: 12,
    name: 'Sports',
    slug: 'sports',
    icon: 'Trophy',
    description: 'Athletic analysis, analytics, major league tournaments, and motorsport.',
    subCategories: [
      { id: 1201, name: 'Sports Analytics', slug: 'sports-analytics', description: 'Data science in athletic performance and game strategy.' },
      { id: 1202, name: 'Football & Basketball', slug: 'football-basketball', description: 'Tactical breakdowns, championship updates, and team dynamics.' },
      { id: 1203, name: 'Formula 1 & Racing', slug: 'formula-1-racing', description: 'Aerodynamics, race telemetry, and driver profiles.' }
    ]
  },
  {
    id: 13,
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'Film',
    description: 'Cinema, music technology, streaming platforms, and digital storytelling.',
    subCategories: [
      { id: 1301, name: 'Cinema & Directing', slug: 'cinema-directing', description: 'Film analysis, visual effects, and cinematic craft.' },
      { id: 1302, name: 'Audio & Music Tech', slug: 'music-tech', description: 'Synthesizers, spatial audio, and digital music production.' }
    ]
  },
  {
    id: 14,
    name: 'Cars',
    slug: 'cars',
    icon: 'Car',
    description: 'Electric vehicles, autonomous driving systems, and automotive engineering.',
    subCategories: [
      { id: 1401, name: 'Electric Vehicles', slug: 'electric-vehicles', description: 'Battery architecture, EV charging networks, and motor tech.' },
      { id: 1402, name: 'Autonomous Driving', slug: 'autonomous-driving', description: 'LiDAR, neural vision systems, and self-driving safety.' }
    ]
  },
  {
    id: 15,
    name: 'Gaming',
    slug: 'gaming',
    icon: 'Gamepad2',
    description: 'Game design, real-time graphics engines, esports, and indie game creation.',
    subCategories: [
      { id: 1501, name: 'Game Engines & Tech', slug: 'game-engines', description: 'Unreal Engine, Unity, Godot, and shader programming.' },
      { id: 1502, name: 'Indie Game Design', slug: 'indie-game-design', description: 'Mechanics, pixel art, narrative design, and publishing.' }
    ]
  }
];

export const MOCK_TICKER_ITEMS = [
  { id: 1, tag: 'AI & TECH', text: 'Autonomous multi-agent systems revolutionize software development cycles', category: 'AI & ML' },
  { id: 2, tag: 'WEB DEV', text: 'React 19 Server Actions and optimistic updates adopted in modern full-stack workflows', category: 'Web Development' },
  { id: 3, tag: 'CLOUD', text: 'Kubernetes introduces native WebAssembly container runtime integrations', category: 'Cloud & DevOps' },
  { id: 4, tag: 'EDUCATION', text: 'Cognitive research proves spaced repetition accelerates technical learning by 300%', category: 'Education' },
  { id: 5, tag: 'AUTO TECH', text: 'Solid-state EV battery prototypes demonstrate 800-mile range on a single charge', category: 'Cars' },
  { id: 6, tag: 'FINTECH', text: 'Unified open banking APIs enable instantaneous international settlement rails', category: 'Finance' }
];

export const MOCK_EVENTS = [
  {
    id: 201,
    title: 'Global Developer Conference & Architecture Summit 2026',
    slug: 'global-developer-conference-2026',
    description: 'Three days of deep-dive workshops on distributed systems, modern microservices, and AI-assisted software engineering.',
    categoryName: 'Technology',
    subCategoryName: 'Java & Spring',
    eventDate: '2026-10-15',
    eventTime: '09:00 AM PST',
    location: 'Moscone Convention Center, San Francisco, CA',
    registrationUrl: 'https://keryx.dev/events/global-dev-2026',
    status: 'UPCOMING',
    organizer: 'Keryx Engineering Foundation',
    coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 202,
    title: 'Generative AI & LLM Systems Hands-On Workshop',
    slug: 'generative-ai-llm-workshop',
    description: 'Learn to build, fine-tune, and deploy autonomous reasoning agents with tool-calling capabilities and vector databases.',
    categoryName: 'AI & Machine Learning',
    subCategoryName: 'LLMs & GenAI',
    eventDate: '2026-10-28',
    eventTime: '10:00 AM EST',
    location: 'Metropolitan Tech Center, New York, NY',
    registrationUrl: 'https://keryx.dev/events/ai-workshop',
    status: 'UPCOMING',
    organizer: 'AI Research Labs',
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-03T11:00:00Z'
  },
  {
    id: 203,
    title: 'Cloud Native & Kubernetes Global Bootcamp',
    slug: 'cloud-native-devops-bootcamp',
    description: 'Intensive masterclass on zero-downtime deployments, multi-region Kubernetes clusters, and automated CI/CD pipelines.',
    categoryName: 'Cloud & DevOps',
    subCategoryName: 'Kubernetes & Docker',
    eventDate: '2026-11-05',
    eventTime: '02:00 PM GMT',
    location: 'ExCeL London Exhibition Centre, London, UK',
    registrationUrl: 'https://keryx.dev/events/cloud-bootcamp',
    status: 'UPCOMING',
    organizer: 'Cloud Native Computing Group',
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-05T12:00:00Z'
  },
  {
    id: 204,
    title: 'Next-Gen Web Frameworks & UI Design Forum',
    slug: 'web-frameworks-ui-forum',
    description: 'Explore the future of frontend engineering: React 19 server actions, micro-animations, glassmorphism tokens, and edge rendering.',
    categoryName: 'Web Development',
    subCategoryName: 'React Ecosystem',
    eventDate: '2026-11-18',
    eventTime: '01:00 PM PST',
    location: 'Seattle Design & Tech Pavilion, Seattle, WA',
    registrationUrl: 'https://keryx.dev/events/web-ui-forum',
    status: 'UPCOMING',
    organizer: 'Modern Web Guild',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-06T14:00:00Z'
  },
  {
    id: 205,
    title: 'International Student Tech Leadership & Career Fair',
    slug: 'student-tech-career-fair',
    description: 'Connect top student developers with leading engineering teams, startup founders, and mentors for summer 2027 internships.',
    categoryName: 'Education',
    subCategoryName: 'Student Career Guides',
    eventDate: '2026-11-25',
    eventTime: '10:00 AM CST',
    location: 'Chicago Innovation Hub, Chicago, IL',
    registrationUrl: 'https://keryx.dev/events/career-fair',
    status: 'UPCOMING',
    organizer: 'University Tech Coalition',
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-08T09:00:00Z'
  },
  {
    id: 206,
    title: 'Clean Energy & Autonomous Vehicle Expo',
    slug: 'clean-energy-ev-expo',
    description: 'Showcasing next-generation electric vehicle powertrains, high-density battery chemistries, and autonomous driver assistance systems.',
    categoryName: 'Cars',
    subCategoryName: 'Electric Vehicles',
    eventDate: '2026-12-02',
    eventTime: '09:30 AM CET',
    location: 'Berlin Mobility Arena, Berlin, Germany',
    registrationUrl: 'https://keryx.dev/events/ev-expo',
    status: 'UPCOMING',
    organizer: 'Future Mobility Alliance',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-10T16:00:00Z'
  }
];

export const MOCK_BLOGS = [
  {
    id: 1,
    title: 'How AI Is Changing the Way Developers Build Software',
    slug: 'how-ai-is-changing-the-way-developers-build-software',
    summary: 'From intelligent pair programming to autonomous agent test suites, artificial intelligence is reshaping engineering velocity and software quality.',
    content: `Artificial intelligence has evolved from simple autocomplete snippets to proactive, reasoning engineering assistants capable of synthesizing entire architectural components.

Modern AI agents can understand repository-wide code graphs, pinpoint potential race conditions, draft comprehensive integration tests, and suggest optimal algorithmic improvements.

### Key Shifts in Modern Development:
1. **Agentic Code Review**: Continuous integration systems now leverage multi-agent reviewers that verify logic correctness and edge-case resilience.
2. **Context-Aware Refactoring**: Automated refactoring that preserves business logic while migrating legacy codebases to modern design patterns.
3. **Natural Language System Specification**: Converting high-level domain requirements directly into executable tests and API stubs.

As developers, our role is shifting from manual boilerplate typing to higher-level system architecture, security auditing, and critical domain judgment.`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    category: { id: 2, name: 'AI & Machine Learning', slug: 'ai-ml' },
    subCategoryName: 'LLMs & GenAI',
    tags: [{ id: 1, name: 'AI', slug: 'ai' }, { id: 2, name: 'Software Engineering', slug: 'software-engineering' }],
    author: {
      id: 2,
      name: 'Alex Mercer',
      email: 'author@blogplatform.com',
      bio: 'Senior Staff Software Engineer & AI Researcher writing on distributed systems and cloud native tech.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 420,
    commentsCount: 38,
    readTime: '5 min read',
    viewsCount: 3420,
    isFeatured: true,
    isTrending: true,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 2,
    title: 'Modern React Patterns Every Developer Should Know',
    slug: 'modern-react-patterns-every-developer-should-know',
    summary: 'Master component composition, custom hook encapsulation, suspense boundaries, and optimistic UI updates in modern React.',
    content: `React architecture in 2026 emphasizes declarative data fetching, minimal re-renders, and modular component composition.

By separating state orchestration from presentational layouts, developers can build scalable user interfaces that are easy to test and maintain.

### Fundamental Modern Patterns:
- **Compound Components**: Build flexible UI widgets where child components share implicit state without prop drilling.
- **Render-As-You-Fetch with Suspense**: Eliminate loading waterfalls by coordinating asynchronous boundaries at the route level.
- **Optimistic State Updates**: Provide instantaneous user feedback for high-latency actions with automatic rollback on server error.`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    category: { id: 4, name: 'Web Development', slug: 'web-development' },
    subCategoryName: 'React Ecosystem',
    tags: [{ id: 3, name: 'React', slug: 'react' }, { id: 4, name: 'Frontend', slug: 'frontend' }],
    author: {
      id: 3,
      name: 'Jane Doe',
      email: 'jane@example.com',
      bio: 'Full Stack Developer & UI/UX enthusiast.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 295,
    commentsCount: 24,
    readTime: '6 min read',
    viewsCount: 2150,
    isFeatured: false,
    isTrending: true,
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 3,
    title: 'Getting Started With Cloud Computing & Scalable Architecture',
    slug: 'getting-started-with-cloud-computing-scalable-architecture',
    summary: 'A comprehensive roadmap for architecting fault-tolerant, cost-efficient, and globally distributed cloud solutions.',
    content: `Cloud computing has revolutionized how modern applications scale to millions of concurrent users.

Understanding core primitives—such as managed container clusters, elastic load balancers, serverless queues, and distributed databases—is essential for any backend engineer.

Key considerations include multi-region failover, infrastructure-as-code automation, and fine-grained IAM security policies.`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: { id: 5, name: 'Cloud & DevOps', slug: 'cloud-devops' },
    subCategoryName: 'AWS & GCP',
    tags: [{ id: 5, name: 'Cloud', slug: 'cloud' }, { id: 6, name: 'DevOps', slug: 'devops' }],
    author: {
      id: 2,
      name: 'Alex Mercer',
      email: 'author@blogplatform.com',
      bio: 'Senior Staff Software Engineer & AI Researcher writing on distributed systems and cloud native tech.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 310,
    commentsCount: 19,
    readTime: '7 min read',
    viewsCount: 2890,
    isFeatured: false,
    isTrending: true,
    createdAt: '2026-08-14T09:15:00Z'
  },
  {
    id: 4,
    title: 'How Students Can Build Better Learning Habits for Lifelong Success',
    slug: 'how-students-can-build-better-learning-habits',
    summary: 'Evidence-based study techniques, active recall strategies, and focus systems to master complex technical concepts faster.',
    content: `Mastering deep technical topics requires more than passive reading. Cognitive science demonstrates that active retrieval and interleaved practice create durable mental models.

By building structured study rituals, eliminating digital distractions, and teaching concepts to peers, students can drastically accelerate their learning curve.`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: { id: 6, name: 'Education', slug: 'education' },
    subCategoryName: 'Learning Strategies',
    tags: [{ id: 7, name: 'Productivity', slug: 'productivity' }, { id: 8, name: 'Study', slug: 'study' }],
    author: {
      id: 4,
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@academic.edu',
      bio: 'Cognitive Scientist & Educational Technology Researcher.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 185,
    commentsCount: 16,
    readTime: '4 min read',
    viewsCount: 1420,
    isFeatured: false,
    isTrending: false,
    createdAt: '2026-08-16T11:00:00Z'
  },
  {
    id: 5,
    title: 'The Future of Digital Business in an Automated World',
    slug: 'the-future-of-digital-business-in-an-automated-world',
    summary: 'How digital-first enterprises are utilizing algorithmic decision-making, micro-transactions, and automated customer journeys.',
    content: `Business models are evolving at unprecedented speed. From automated supply chain forecasting to personalized AI customer interactions, modern enterprises are transforming into agile software platforms.

Leaders must balance rapid technological adoption with data privacy, transparency, and sustainable team growth.`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: { id: 7, name: 'Business', slug: 'business' },
    subCategoryName: 'Startups & SaaS',
    tags: [{ id: 9, name: 'Business', slug: 'business' }, { id: 10, name: 'Strategy', slug: 'strategy' }],
    author: {
      id: 5,
      name: 'Marcus Vance',
      email: 'marcus@venturecapital.io',
      bio: 'Venture Partner & Enterprise Strategist.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 240,
    commentsCount: 22,
    readTime: '5 min read',
    viewsCount: 1980,
    isFeatured: false,
    isTrending: true,
    createdAt: '2026-08-18T16:45:00Z'
  },
  {
    id: 6,
    title: 'How Electric Vehicles Are Changing the Global Auto Industry',
    slug: 'how-electric-vehicles-are-changing-the-global-auto-industry',
    summary: 'An inside look at battery chemistry innovations, software-defined vehicle architectures, and charging infrastructure scale.',
    content: `The automotive landscape is undergoing its largest disruption in over a century. Electric drivetrains, combined with over-the-air software updates and advanced autonomous vision systems, are turning cars into high-performance computing platforms on wheels.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: { id: 14, name: 'Cars', slug: 'cars' },
    subCategoryName: 'Electric Vehicles',
    tags: [{ id: 11, name: 'EV', slug: 'ev' }, { id: 12, name: 'Automotive', slug: 'automotive' }],
    author: {
      id: 2,
      name: 'Alex Mercer',
      email: 'author@blogplatform.com',
      bio: 'Senior Staff Software Engineer & AI Researcher writing on distributed systems and cloud native tech.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 360,
    commentsCount: 31,
    readTime: '6 min read',
    viewsCount: 2640,
    isFeatured: false,
    isTrending: true,
    createdAt: '2026-08-20T13:20:00Z'
  },
  {
    id: 7,
    title: 'Understanding Cybersecurity & Zero-Trust Architecture in the Modern Web',
    slug: 'understanding-cybersecurity-and-zero-trust-architecture',
    summary: 'Why perimeter security is dead and how modern organizations implement identity-first, continuous authorization models.',
    content: `Modern network boundaries are perimeter-less. Zero Trust architecture operates on the core principle: never trust, always verify.

Every API request, microservice call, and user session must be continuously authenticated, encrypted, and authorized with minimal privilege principles.`,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    category: { id: 1, name: 'Technology', slug: 'technology' },
    subCategoryName: 'Cybersecurity',
    tags: [{ id: 13, name: 'Security', slug: 'security' }, { id: 14, name: 'ZeroTrust', slug: 'zerotrust' }],
    author: {
      id: 3,
      name: 'Jane Doe',
      email: 'jane@example.com',
      bio: 'Full Stack Developer & UI/UX enthusiast.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 275,
    commentsCount: 20,
    readTime: '5 min read',
    viewsCount: 1890,
    isFeatured: false,
    isTrending: false,
    createdAt: '2026-08-22T08:30:00Z'
  },
  {
    id: 8,
    title: 'How Big Data & Analytics Are Changing Modern Sports',
    slug: 'how-big-data-and-analytics-are-changing-modern-sports',
    summary: 'From real-time athlete biometrics to computer vision tactical positioning, data science is elevating competitive sports performance.',
    content: `Modern sports franchises rely heavily on high-frequency telemetry, predictive injury modeling, and automated video spatial analysis. Coaches and athletes use data intelligence to make micro-second strategic adjustments that decide championship outcomes.`,
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    category: { id: 12, name: 'Sports', slug: 'sports' },
    subCategoryName: 'Sports Analytics',
    tags: [{ id: 15, name: 'Sports', slug: 'sports' }, { id: 16, name: 'DataScience', slug: 'datascience' }],
    author: {
      id: 5,
      name: 'Marcus Vance',
      email: 'marcus@venturecapital.io',
      bio: 'Venture Partner & Enterprise Strategist.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 210,
    commentsCount: 15,
    readTime: '4 min read',
    viewsCount: 1650,
    isFeatured: false,
    isTrending: false,
    createdAt: '2026-08-24T15:10:00Z'
  }
];

export const MOCK_NEWS = [
  {
    id: 1,
    title: 'Next-Gen Autonomous AI Coding Engines Achieve Zero-Regression Benchmarks',
    slug: 'next-gen-autonomous-ai-coding-engines-achieve-benchmarks',
    summary: 'Global AI research laboratories unveil self-reflective reasoning models capable of refactoring enterprise codebases.',
    content: 'Researchers have unveiled a breakthrough in multi-agent coding engines that reason iteratively, run automated compiler checks, and eliminate software bugs autonomously with exceptional accuracy.',
    categoryName: 'AI & Machine Learning',
    subCategoryName: 'LLMs & GenAI',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true,
    isTrending: true,
    isTopStory: true,
    authorName: 'Dr. Elena Rostova',
    viewsCount: 4890,
    publishedAt: '2026-09-01T09:00:00Z',
    createdAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 2,
    title: 'Global Cloud Consortium Announces Unified Open Streaming Standard',
    slug: 'global-cloud-consortium-announces-unified-streaming-standard',
    summary: 'Major technology leaders collaborate to establish standardized, low-latency protocols for real-time applications.',
    content: 'Leading cloud platforms and open-source foundations today ratified an open protocol specification for ultra-low latency event streaming and bidirectional distributed communication.',
    categoryName: 'Cloud & DevOps',
    subCategoryName: 'CI/CD & Automation',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    isBreaking: false,
    isTrending: true,
    isTopStory: true,
    authorName: 'Alex Mercer',
    viewsCount: 3210,
    publishedAt: '2026-09-02T11:30:00Z',
    createdAt: '2026-09-02T11:30:00Z'
  },
  {
    id: 3,
    title: 'Next-Generation Solid-State Battery Prototypes Reach Commercial Testing Phase',
    slug: 'next-gen-solid-state-battery-reaches-commercial-testing',
    summary: 'Automotive engineers begin highway validation for solid-state cells promising 10-minute fast charging.',
    content: 'Commercial testing has begun on solid-state battery packs offering double the energy density of conventional lithium-ion cells, with rapid 10-minute charging capabilities in real-world conditions.',
    categoryName: 'Cars',
    subCategoryName: 'Electric Vehicles',
    isTopStory: true,
    authorName: 'David Chen',
    viewsCount: 2780,
    publishedAt: '2026-09-03T14:00:00Z',
    createdAt: '2026-09-03T14:00:00Z'
  }
];

export const MOCK_COMMENTS = [
  {
    id: 1,
    content: "Excellent breakdown of the architectural shifts. The point on agentic code reviews matches what we're deploying in our CI/CD pipelines.",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-08-25T14:30:00Z"
  },
  {
    id: 2,
    content: "Very clear explanation. Optimistic updates and Suspense boundaries have dramatically improved our user experience metrics.",
    authorName: "Alex Mercer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-08-26T09:15:00Z"
  },
  {
    id: 3,
    content: "Great read on zero-trust principles. Identity-based perimeter defense is an absolute must-have in 2026.",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-08-27T16:40:00Z"
  }
];


