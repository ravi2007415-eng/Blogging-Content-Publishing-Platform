export const MOCK_BLOGS = [
  {
    id: 101,
    title: 'Building Scalable Event-Driven Microservices in Java & Spring Boot',
    slug: 'building-scalable-event-driven-microservices',
    summary: 'Explore how event-driven architecture using Kafka, RabbitMQ, and Spring Cloud Stream can supercharge your backend systems with high throughput and resiliency.',
    content: `Event-driven architecture (EDA) has transformed the landscape of software engineering. By decoupling microservices into producers and consumers of asynchronous events, teams can achieve unprecedented scalability, fault tolerance, and developer velocity.

### Why Event-Driven Architecture?

Traditional REST-based synchronous HTTP communication can introduce hard dependencies between microservices. When Service A calls Service B, which calls Service C, any delay or outage downstream cascades back up the chain.

#### Key Benefits of Event-Driven Systems:
- **Decoupling**: Services only need to know about the events they publish or consume.
- **Asynchronous Execution**: Long-running operations execute in background worker queues without blocking user threads.
- **Backpressure Handling**: Message brokers act as buffers during high-traffic spikes.

\`\`\`java
@Service
public class OrderEventPublisher {
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order.getId(), order.getTotalAmount());
        kafkaTemplate.send("orders.topic", order.getId().toString(), event);
    }
}
\`\`\`

### Summary

Adopting event-driven principles requires a mindset shift from state mutation to immutable domain events, but the resulting resiliency and system capability make it essential for enterprise platforms.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: { id: 1, name: 'Software Engineering', slug: 'software-engineering' },
    tags: [{ id: 1, name: 'Microservices', slug: 'microservices' }, { id: 2, name: 'Spring Boot', slug: 'spring-boot' }, { id: 3, name: 'Kafka', slug: 'kafka' }],
    author: {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex@nexus.dev',
      bio: 'Principal Systems Architect building distributed cloud architectures.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 142,
    commentsCount: 18,
    readTime: '6 min read',
    status: 'PUBLISHED',
    createdAt: '2026-07-28T10:15:00Z',
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 102,
    title: 'The Rise of Autonomous AI Agents: Next-Gen LLM Architectures',
    slug: 'rise-of-autonomous-ai-agents',
    summary: 'A deep dive into how multi-agent frameworks, tool usage, and memory persistence are unlocking state-of-the-art synthetic reasoning.',
    content: `Artificial intelligence is rapidly shifting from passive text generation to proactive autonomous agent execution. Agents can plan workflows, invoke specialized external APIs, and execute complex code autonomously.

### Core Components of an Autonomous Agent:

1. **Planner**: Deconstructs high-level user instructions into sequential tasks.
2. **Tool Registry**: Equips the agent with execution tools (file operations, web search, database execution).
3. **Memory Layer**: Short-term conversation context and long-term vector database storage.

> "The true power of AI lies in context awareness and agentic execution rather than simple instruction following."

\`\`\`python
class AgentLoop:
    def __init__(self, LLM, tools):
        self.llm = LLM
        self.tools = tools

    def execute(self, user_prompt):
        plan = self.llm.create_plan(user_prompt)
        for step in plan.steps:
            result = self.tools.invoke(step.action, step.args)
            self.llm.update_context(result)
\`\`\`

By combining robust tool validation and self-reflection loops, AI agents can reliably perform pair programming, data engineering, and automation.`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: { id: 2, name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    tags: [{ id: 4, name: 'LLM', slug: 'llm' }, { id: 5, name: 'AI Agents', slug: 'ai-agents' }, { id: 6, name: 'Python', slug: 'python' }],
    author: {
      id: 2,
      name: 'Dr. Elena Rostova',
      email: 'elena@nexus.dev',
      bio: 'AI Researcher focused on LLM Reasoning and Multi-Agent Orchestration.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 289,
    commentsCount: 34,
    readTime: '8 min read',
    status: 'PUBLISHED',
    createdAt: '2026-07-30T14:30:00Z',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 103,
    title: 'Mastering Modern UI Design: Glassmorphism & Micro-Animations',
    slug: 'mastering-modern-ui-design-glassmorphism',
    summary: 'Craft visually stunning web interfaces with modern CSS tokens, dark mode gradients, dynamic glass panels, and fluid hover micro-interactions.',
    content: `User interface aesthetics play a defining role in product experience. Modern design trends blend glassmorphic backdrop filters, custom vibrant color gradients, and responsive typography to deliver software that users love to interact with.

### Key CSS Tokens for Glassmorphism:

\`\`\`css
.glass-panel {
  background: rgba(18, 24, 36, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
\`\`\`

#### Design Checklist:
- **Typography**: Paired Google Fonts like *Inter* for body readability and *Outfit* for crisp geometric headers.
- **Color Contrast**: Accessible dark mode tokens with glowing accent highlights.
- **Interactive Feedback**: Hover transitions with slight elevation lift and subtle glow.`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    category: { id: 3, name: 'Web Development', slug: 'web-development' },
    tags: [{ id: 7, name: 'UI/UX', slug: 'ui-ux' }, { id: 8, name: 'CSS', slug: 'css' }, { id: 9, name: 'React', slug: 'react' }],
    author: {
      id: 3,
      name: 'Marcus Vance',
      email: 'marcus@nexus.dev',
      bio: 'Lead Frontend Engineer & Creative UI Technologist.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 95,
    commentsCount: 12,
    readTime: '4 min read',
    status: 'PUBLISHED',
    createdAt: '2026-08-01T09:45:00Z',
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 104,
    title: 'Cloud-Native Infrastructure: GitOps Workflows with Kubernetes & Helm',
    slug: 'cloud-native-infrastructure-gitops-kubernetes',
    summary: 'Automate cluster deployments, declarative state synchronization, and zero-downtime releases using ArgoCD and cloud native tools.',
    content: `Managing production infrastructure manually is a recipe for configuration drift and outage risks. GitOps treats infrastructure code as the single source of truth stored directly in Git.

When developers push changes to Git repositories, automated operators continuously reconcile desired state with live Kubernetes clusters.`,
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    category: { id: 4, name: 'DevOps & Cloud', slug: 'devops-cloud' },
    tags: [{ id: 10, name: 'Kubernetes', slug: 'kubernetes' }, { id: 11, name: 'DevOps', slug: 'devops' }, { id: 12, name: 'GitOps', slug: 'gitops' }],
    author: {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex@nexus.dev',
      bio: 'Principal Systems Architect building distributed cloud architectures.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    likesCount: 176,
    commentsCount: 22,
    readTime: '7 min read',
    status: 'PUBLISHED',
    createdAt: '2026-08-02T11:20:00Z',
    isLiked: true,
    isBookmarked: false,
  }
];

export const MOCK_COMMENTS = [
  {
    id: 1,
    content: 'Fantastic article! The explanation of event-driven backpressure is crystal clear.',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-07-29T12:00:00Z',
  },
  {
    id: 2,
    content: 'Would love to see a follow-up piece comparing Kafka against Pulsar for high volume events!',
    authorName: 'David Miller',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-07-29T15:30:00Z',
  }
];
