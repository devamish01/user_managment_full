/**
 * Mock Event Data for Public Home Page
 * This can later be replaced with API calls to the Events backend
 */

export interface PublicEvent {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  location: string;
  imageUrl?: string;
  category: "conference" | "workshop" | "webinar" | "meetup" | "hackathon";
  isFeatured: boolean;
  registrationUrl?: string;
  capacity?: number;
  registeredCount?: number;
  tags: string[];
  organizer: string;
}

export const mockEvents: PublicEvent[] = [
  {
    id: "evt-001",
    title: "Nexus Tech Conference 2025",
    description:
      "Join us for the biggest technology conference of the year! Nexus Tech Conference 2025 brings together industry leaders, innovators, and developers from around the world for three days of keynotes, workshops, and networking. Explore the latest trends in AI, cloud computing, blockchain, and more.",
    shortDescription:
      "The biggest technology conference of the year featuring AI, cloud, blockchain, and more.",
    startDate: "2025-03-15T09:00:00Z",
    endDate: "2025-03-17T18:00:00Z",
    location: "San Francisco, CA - Moscone Center",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    category: "conference",
    isFeatured: true,
    registrationUrl: "https://example.com/register/nexus-tech-2025",
    capacity: 5000,
    registeredCount: 3247,
    tags: ["AI", "Cloud", "Blockchain", "Networking"],
    organizer: "Nexus Events Team",
  },
  {
    id: "evt-002",
    title: "React Advanced Workshop",
    description:
      "Deep dive into advanced React patterns including Server Components, Suspense, concurrent features, and performance optimization. This hands-on workshop is designed for experienced React developers looking to level up their skills.",
    shortDescription:
      "Master advanced React patterns including Server Components and concurrent features.",
    startDate: "2025-02-20T10:00:00Z",
    endDate: "2025-02-20T17:00:00Z",
    location: "Online (Zoom)",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    category: "workshop",
    isFeatured: true,
    registrationUrl: "https://example.com/register/react-advanced",
    capacity: 100,
    registeredCount: 78,
    tags: ["React", "Server Components", "Performance"],
    organizer: "React Core Team",
  },
  {
    id: "evt-003",
    title: "AI & Machine Learning Summit",
    description:
      "Explore the cutting edge of artificial intelligence and machine learning. Featuring talks from researchers at top labs, practical workshops on MLOps, and panels on AI ethics and governance.",
    shortDescription:
      "Cutting-edge AI/ML summit with researchers and industry practitioners.",
    startDate: "2025-04-10T09:00:00Z",
    endDate: "2025-04-11T17:00:00Z",
    location: "New York, NY - Javits Center",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    category: "conference",
    isFeatured: true,
    registrationUrl: "https://example.com/register/ai-ml-summit",
    capacity: 2000,
    registeredCount: 1156,
    tags: ["AI", "Machine Learning", "MLOps", "Ethics"],
    organizer: "AI Research Institute",
  },
  {
    id: "evt-004",
    title: "DevOps Days Global",
    description:
      "A community-driven conference for DevOps practitioners. Learn about CI/CD, infrastructure as code, observability, platform engineering, and culture transformation from peers around the world.",
    shortDescription:
      "Community-driven DevOps conference covering CI/CD, IaC, and platform engineering.",
    startDate: "2025-05-05T09:00:00Z",
    endDate: "2025-05-06T18:00:00Z",
    location: "London, UK - ExCeL London",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
    category: "conference",
    isFeatured: false,
    registrationUrl: "https://example.com/register/devops-days",
    capacity: 1500,
    registeredCount: 892,
    tags: ["DevOps", "CI/CD", "Platform Engineering", "Observability"],
    organizer: "DevOps Days Community",
  },
  {
    id: "evt-005",
    title: "Web3 Developer Bootcamp",
    description:
      "Intensive 3-day bootcamp for developers entering the Web3 space. Covers smart contract development, DeFi protocols, NFT standards, and building decentralized applications.",
    shortDescription:
      "3-day intensive bootcamp for Web3 development fundamentals.",
    startDate: "2025-03-01T09:00:00Z",
    endDate: "2025-03-03T18:00:00Z",
    location: "Austin, TX - Capital Factory",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    category: "workshop",
    isFeatured: false,
    registrationUrl: "https://example.com/register/web3-bootcamp",
    capacity: 200,
    registeredCount: 156,
    tags: ["Web3", "Smart Contracts", "DeFi", "NFTs"],
    organizer: "Web3 Education DAO",
  },
  {
    id: "evt-006",
    title: "Open Source Sustainability Forum",
    description:
      "Discussing the future of open source funding, governance, and community health. Featuring maintainers, sponsors, and policy makers.",
    shortDescription:
      "Forum on open source funding, governance, and community sustainability.",
    startDate: "2025-06-15T10:00:00Z",
    endDate: "2025-06-15T16:00:00Z",
    location: "Online (Discord + YouTube)",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    category: "meetup",
    isFeatured: false,
    registrationUrl: "https://example.com/register/oss-forum",
    capacity: 500,
    registeredCount: 234,
    tags: ["Open Source", "Funding", "Governance", "Community"],
    organizer: "Open Collective Foundation",
  },
];

/**
 * Get the next upcoming event (for countdown)
 */
export const getNextUpcomingEvent = (): PublicEvent | null => {
  const now = new Date();
  const upcoming = mockEvents
    .filter((event) => new Date(event.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return upcoming.length > 0 ? upcoming[0] : null;
};

/**
 * Get featured events
 */
export const getFeaturedEvents = (): PublicEvent[] => {
  return mockEvents.filter((event) => event.isFeatured);
};

/**
 * Get all upcoming events sorted by date
 */
export const getUpcomingEvents = (limit?: number): PublicEvent[] => {
  const now = new Date();
  const upcoming = mockEvents
    .filter((event) => new Date(event.endDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return limit ? upcoming.slice(0, limit) : upcoming;
};

/**
 * Get events by category
 */
export const getEventsByCategory = (category: PublicEvent["category"]): PublicEvent[] => {
  return mockEvents.filter((event) => event.category === category);
};