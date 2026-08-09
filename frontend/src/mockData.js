export const INITIAL_TAXONOMY = [
  {
    id: 1,
    name: 'Sports',
    slug: 'sports',
    icon: 'Trophy',
    description: 'Live scores, tournament highlights, athlete profiles, and upcoming matches across all sports.',
    subCategories: [
      { id: 101, name: 'Cricket', slug: 'cricket', description: 'IPL, Test matches, ODIs, and T20 updates.' },
      { id: 102, name: 'Volleyball', slug: 'volleyball', description: 'Beach volleyball, state leagues, and national tournaments.' },
      { id: 103, name: 'Football', slug: 'football', description: 'Champions League, Premier League, World Cup qualifiers.' },
      { id: 104, name: 'Basketball', slug: 'basketball', description: 'NBA highlights, EuroLeague, and college hoops.' },
      { id: 105, name: 'Tennis', slug: 'tennis', description: 'Grand Slams, ATP tour, and WTA rankings.' },
      { id: 106, name: 'Badminton', slug: 'badminton', description: 'BWF world tour, Thomas Cup, and singles action.' }
    ]
  },
  {
    id: 2,
    name: 'Politics',
    slug: 'politics',
    icon: 'Landmark',
    description: 'In-depth policy analysis, election coverage, and geopolitical developments.',
    subCategories: [
      { id: 201, name: 'National', slug: 'national', description: 'Federal legislation, parliament sessions, and national governance.' },
      { id: 202, name: 'State', slug: 'state', description: 'Regional elections, local policies, and state assembly news.' },
      { id: 203, name: 'International', slug: 'international', description: 'Diplomatic summits, foreign affairs, and UN treaties.' }
    ]
  },
  {
    id: 3,
    name: 'Technology',
    slug: 'technology',
    icon: 'Cpu',
    description: 'Cutting-edge innovation, software engineering, hardware reviews, and AI research.',
    subCategories: [
      { id: 301, name: 'AI & ML', slug: 'ai-ml', description: 'LLMs, generative models, neural networks, and synthetic intelligence.' },
      { id: 302, name: 'Software', slug: 'software', description: 'System design, React, Spring Boot, microservices, and clean code.' },
      { id: 303, name: 'Gadgets', slug: 'gadgets', description: 'Smartphones, wearables, laptops, and consumer electronics.' },
      { id: 304, name: 'Cyber Security', slug: 'cyber-security', description: 'Zero-day exploits, encryption protocols, and threat intelligence.' },
      { id: 305, name: 'Cloud', slug: 'cloud', description: 'AWS, GCP, Kubernetes, serverless, and cloud infrastructure.' }
    ]
  },
  {
    id: 4,
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'Film',
    description: 'Movie reviews, music releases, streaming shows, gaming, and celebrity updates.',
    subCategories: [
      { id: 401, name: 'Movies', slug: 'movies', description: 'Box office hits, indie cinema, and trailer breakdowns.' },
      { id: 402, name: 'Music', slug: 'music', description: 'Album releases, concert tours, and music charts.' },
      { id: 403, name: 'OTT', slug: 'ott', description: 'Netflix, Prime, Disney+, and streaming series reviews.' },
      { id: 404, name: 'Celebrities', slug: 'celebrities', description: 'Interviews, red carpet events, and pop culture.' },
      { id: 405, name: 'Gaming', slug: 'gaming', description: 'Esports tournaments, console launches, and PC gaming.' }
    ]
  },
  {
    id: 5,
    name: 'Comedy',
    slug: 'comedy',
    icon: 'Smile',
    description: 'Humor, viral memes, stand-up comedy specials, and satirical commentary.',
    subCategories: [
      { id: 501, name: 'Memes', slug: 'memes', description: 'Trending internet memes and viral humor.' },
      { id: 502, name: 'Stand-up', slug: 'stand-up', description: 'Comedy tours, specials, and comedian spotlights.' },
      { id: 503, name: 'Viral Content', slug: 'viral-content', description: 'Funny social media moments and short clips.' }
    ]
  },
  {
    id: 6,
    name: 'Events',
    slug: 'events',
    icon: 'Calendar',
    description: 'Upcoming conferences, tournaments, campus festivals, and cultural gatherings.',
    subCategories: [
      { id: 601, name: 'Sports Events', slug: 'sports-events', description: 'Local, national, and international tournaments.' },
      { id: 602, name: 'College Events', slug: 'college-events', description: 'University hackathons, fests, and sports meets.' },
      { id: 603, name: 'Cultural Events', slug: 'cultural-events', description: 'Art exhibitions, music fests, and drama plays.' },
      { id: 604, name: 'Conferences', slug: 'conferences', description: 'Tech summits, business expos, and research symposia.' },
      { id: 605, name: 'Upcoming Events', slug: 'upcoming-events', description: 'Chronological list of all scheduled events.' }
    ]
  },
  {
    id: 7,
    name: 'Education',
    slug: 'education',
    icon: 'GraduationCap',
    description: 'Academic guides, online courses, research papers, and career advancement.',
    subCategories: [
      { id: 701, name: 'STEM', slug: 'stem', description: 'Science, technology, engineering, and mathematics.' },
      { id: 702, name: 'Online Courses', slug: 'online-courses', description: 'MOOCs, bootcamps, and certifications.' }
    ]
  },
  {
    id: 8,
    name: 'Business',
    slug: 'business',
    icon: 'TrendingUp',
    description: 'Stock markets, startup funding, venture capital, and macroeconomics.',
    subCategories: [
      { id: 801, name: 'Startups', slug: 'startups', description: 'Y Combinator, seed funding, and pitch decks.' },
      { id: 802, name: 'Economy', slug: 'economy', description: 'Inflation rates, central bank policies, and global trade.' }
    ]
  },
  {
    id: 9,
    name: 'Automobile',
    slug: 'automobile',
    icon: 'Car',
    description: 'Electric vehicles, autonomous driving, supercar reveals, and industry news.',
    subCategories: [
      { id: 901, name: 'EVs', slug: 'evs', description: 'Battery tech, charging networks, and Tesla updates.' },
      { id: 902, name: 'Supercars', slug: 'supercars', description: 'Performance engineering and hypercars.' }
    ]
  }
];

export const MOCK_TICKER_ITEMS = [
  { id: 1, tag: 'BREAKING', text: 'National Volleyball Tournament Finals Scheduled for Next Month in San Francisco', category: 'Sports' },
  { id: 2, tag: 'TECH UPDATE', text: 'Keryx v2.4 Real-Time Broadcasting Engine Deployed Live Across All Nodes', category: 'Technology' },
  { id: 3, tag: 'EVENT ALERT', text: 'Global Autonomous AI Summit Registration Now Open - Early Bird Tickets Available', category: 'Events' },
  { id: 4, tag: 'TRENDING', text: 'Next-Gen React 19 Compiler Benchmarks Released: 40% Speed Boost', category: 'Technology' }
];

export const MOCK_EVENTS = [
  {
    id: 201,
    title: 'National Grand Volleyball Championship 2026',
    slug: 'national-volleyball-championship-2026',
    description: 'The premier national volleyball event featuring top 16 state teams competing for the gold trophy with live commentary.',
    categoryName: 'Sports',
    subCategoryName: 'Volleyball',
    eventDate: '2026-09-15',
    eventTime: '09:00 AM PST',
    location: 'Pacific Sports Arena, San Francisco, CA',
    registrationUrl: 'https://volleyball2026.example.com/register',
    status: 'UPCOMING',
    organizer: 'National Volleyball Federation',
    coverImageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 202,
    title: 'Global AI & Autonomous Robotics Summit 2026',
    slug: 'global-ai-robotics-summit-2026',
    description: 'Three days of keynote talks from leading AI researchers, live humanoid robot demonstrations, and agentic LLM workshops.',
    categoryName: 'Technology',
    subCategoryName: 'AI & ML',
    eventDate: '2026-10-05',
    eventTime: '08:30 AM EST',
    location: 'Convention Center, Boston, MA',
    registrationUrl: 'https://aisummit2026.example.com/tickets',
    status: 'UPCOMING',
    organizer: 'AI Research Alliance',
    coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-02T14:20:00Z'
  },
  {
    id: 203,
    title: 'Premier League Football Night: Derby Showdown',
    slug: 'premier-league-derby-showdown',
    description: 'High-stakes football showdown between top league rivals broadcasted live to millions of sports fans worldwide.',
    categoryName: 'Sports',
    subCategoryName: 'Football',
    eventDate: '2026-08-28',
    eventTime: '07:45 PM GMT',
    location: 'Wembley Stadium, London, UK',
    registrationUrl: 'https://footballtix.example.com/derby',
    status: 'UPCOMING',
    organizer: 'Premier League League Committee',
    coverImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-03T11:00:00Z'
  },
  {
    id: 204,
    title: 'Inter-College Hackathon & Cultural Fest',
    slug: 'inter-college-hackathon-fest',
    description: '24-hour coding competition, live music concerts, esports gaming arenas, and cultural dance performances.',
    categoryName: 'Events',
    subCategoryName: 'College Events',
    eventDate: '2026-09-20',
    eventTime: '10:00 AM EST',
    location: 'MIT Campus Center, Cambridge, MA',
    registrationUrl: 'https://collegefest.example.com/apply',
    status: 'UPCOMING',
    organizer: 'Student Senate Board',
    coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-04T09:15:00Z'
  }
];

export const MOCK_BLOGS = [
  {
    id: 101,
    title: 'Upcoming Volleyball Tournament Next Month: Team Roster & Schedule Analysis',
    slug: 'upcoming-volleyball-tournament-next-month',
    summary: 'The national volleyball season reaches peak momentum as top teams prepare for next month’s tournament in San Francisco.',
    content: `Volleyball enthusiasts across the nation are gearing up for next month's Grand Volleyball Championship. With sixteen elite state teams competing, the tournament promises world-class spike setups, block defenses, and intense rally action.

### Key Highlights for Next Month's Tournament:
1. **Defending Champions**: Golden State Spikers return with their star setter.
2. **Key Matchups**: Opening round pairs California and Texas in a classic rivalry match.
3. **Live Streaming**: All matches will be broadcasted live on Keryx Sports Channel.

> "This season's defensive speed and jump serve stats are higher than any previous championship in modern volleyball history."

Be sure to check out the **Upcoming Events** section to register for spectator passes and court-side VIP access!`,
    coverImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    category: { id: 1, name: 'Sports', slug: 'sports' },
    subCategoryName: 'Volleyball',
    tags: [{ id: 1, name: 'Volleyball', slug: 'volleyball' }, { id: 2, name: 'Tournament', slug: 'tournament' }, { id: 3, name: 'Sports', slug: 'sports' }],
    author: {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex@keryx.dev',
      bio: 'Principal Systems Architect & Senior Sports Journalist.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 215,
    commentsCount: 32,
    readTime: '5 min read',
    status: 'PUBLISHED',
    isTrending: true,
    isFeatured: true,
    createdAt: '2026-08-07T10:15:00Z',
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: 102,
    title: 'Building Scalable Event-Driven Microservices in Java & Spring Boot',
    slug: 'building-scalable-event-driven-microservices',
    summary: 'Explore how event-driven architecture using Kafka, RabbitMQ, and Spring Cloud Stream supercharges backend throughput.',
    content: `Event-driven architecture (EDA) decouples microservices into producers and consumers of asynchronous events, delivering high scalability and fault tolerance.

### Why Event-Driven Architecture?
- **Decoupling**: Services only react to events.
- **Asynchronous Execution**: Background worker queues execute heavy tasks.
- **Backpressure**: Message brokers handle traffic spikes cleanly.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: { id: 3, name: 'Technology', slug: 'technology' },
    subCategoryName: 'Software',
    tags: [{ id: 4, name: 'Microservices', slug: 'microservices' }, { id: 5, name: 'Spring Boot', slug: 'spring-boot' }],
    author: {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex@keryx.dev',
      bio: 'Principal Systems Architect building distributed cloud architectures.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 142,
    commentsCount: 18,
    readTime: '6 min read',
    status: 'PUBLISHED',
    isTrending: false,
    isFeatured: false,
    createdAt: '2026-07-28T10:15:00Z',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 103,
    title: 'The Rise of Autonomous AI Agents: Next-Gen LLM Architectures',
    slug: 'rise-of-autonomous-ai-agents',
    summary: 'A deep dive into multi-agent frameworks, tool usage, and memory persistence for synthetic reasoning.',
    content: `Artificial intelligence is rapidly shifting from passive text generation to proactive autonomous agent execution. Agents can plan workflows, invoke specialized external APIs, and execute complex code.`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: { id: 3, name: 'Technology', slug: 'technology' },
    subCategoryName: 'AI & ML',
    tags: [{ id: 6, name: 'AI Agents', slug: 'ai-agents' }, { id: 7, name: 'LLM', slug: 'llm' }],
    author: {
      id: 2,
      name: 'Dr. Elena Rostova',
      email: 'elena@keryx.dev',
      bio: 'AI Researcher focused on LLM Reasoning and Multi-Agent Orchestration.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 289,
    commentsCount: 34,
    readTime: '8 min read',
    status: 'PUBLISHED',
    isTrending: true,
    isFeatured: true,
    createdAt: '2026-07-30T14:30:00Z',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 104,
    title: 'Cricket World Cup Selection Breakdown: New Stars & Bowling Strategy',
    slug: 'cricket-world-cup-selection-breakdown',
    summary: 'Analysing national cricket squad selections, pace bowling rotations, and middle-order batting stability.',
    content: `With the international cricket season heating up, selectors have unveiled the final squad lineup. The inclusion of young explosive all-rounders adds depth to both batting and bowling departments.`,
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    category: { id: 1, name: 'Sports', slug: 'sports' },
    subCategoryName: 'Cricket',
    tags: [{ id: 8, name: 'Cricket', slug: 'cricket' }, { id: 9, name: 'World Cup', slug: 'world-cup' }],
    author: {
      id: 3,
      name: 'Marcus Vance',
      email: 'marcus@keryx.dev',
      bio: 'Sports Analyst & Senior Editor.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 198,
    commentsCount: 26,
    readTime: '5 min read',
    status: 'PUBLISHED',
    isTrending: true,
    isFeatured: false,
    createdAt: '2026-08-05T16:00:00Z',
    isLiked: false,
    isBookmarked: true,
  }
];
