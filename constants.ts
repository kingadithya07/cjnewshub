

import { Article, EPaperPage, User, Advertisement, AdSize, EmailSettings, SubscriptionSettings } from './types';

export const CATEGORIES = ['World', 'Business', 'Technology', 'Culture', 'Sports', 'Opinion'];

export const CHIEF_EDITOR_ID = 'admin1';

// A hardcoded Master Key for the Chief Editor to recover account if email access is lost
export const MASTER_RECOVERY_KEY = 'CHIEF-SECURE-2025';

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
    apiKey: 'SIMULATED-KEY-12345',
    senderEmail: 'support@cjnewshub.com',
    companyName: 'CJ News Hub',
    emailTemplate: "Hi {name},\nhere is your verification code please enter to change your password/passcode {code}\n\nthankyou for contact support team \n{companyName}"
};

export const DEFAULT_SUBSCRIPTION_SETTINGS: SubscriptionSettings = {
  showPaymentButton: false, // Default to false to remove payment page appearance
  paymentLink: 'https://paypal.com',
  monthlyPrice: '$9.99'
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: "Global Markets Rally as Tech Sector Rebounds Unexpectedly",
    excerpt: "Investors are celebrating a surprising turn of events in the silicon valley sector as major players announce breakthrough earnings for Q3.",
    category: "Business",
    author: "Eleanor Rigby",
    authorId: 'admin1',
    date: "24-11-2025",
    imageUrl: "https://picsum.photos/800/400",
    content: "Full article content goes here...",
    tags: ["Finance", "Silicon Valley", "Stocks"],
    status: 'published',
    isFeatured: true,
    views: 12540
  },
  {
    id: '2',
    title: "The Renaissance of Modern Architecture in Europe",
    excerpt: "A look into how sustainable materials are reshaping the skylines of Paris, Berlin, and Rome without compromising historical integrity.",
    category: "Culture",
    author: "Jean-Luc Picard",
    authorId: 'admin1',
    date: "23-11-2025",
    imageUrl: "https://picsum.photos/800/401",
    content: "Full article content goes here...",
    tags: ["Architecture", "Europe", "Sustainability"],
    status: 'published',
    isFeatured: false,
    views: 8432
  },
  {
    id: '3',
    title: "New AI Regulations Proposed by Summit Leaders",
    excerpt: "The annual tech summit concluded with a unanimous agreement on the ethical deployment of generative models in public sectors.",
    category: "Technology",
    author: "Sarah Connor",
    authorId: 'admin1',
    date: "24-11-2025",
    imageUrl: "https://picsum.photos/800/402",
    content: "Full article content goes here...",
    tags: ["AI", "Policy", "Tech Summit"],
    status: 'published',
    isFeatured: false,
    views: 15600
  }
];

export const INITIAL_EPAPER_PAGES: EPaperPage[] = [
  {
    id: 'p1',
    pageNumber: 1,
    imageUrl: "https://picsum.photos/1200/1800", // Tall aspect ratio for paper
    date: "2025-11-24",
    status: 'active'
  },
  {
    id: 'p2',
    pageNumber: 2,
    imageUrl: "https://picsum.photos/1200/1801",
    date: "2025-11-24",
    status: 'active'
  },
  {
    id: 'p3',
    pageNumber: 3,
    imageUrl: "https://picsum.photos/1200/1802",
    date: "2025-11-24",
    status: 'active'
  },
  // Archive Data
  {
    id: 'old_p1',
    pageNumber: 1,
    imageUrl: "https://picsum.photos/1200/1803",
    date: "2025-11-20",
    status: 'active'
  },
  {
    id: 'old_p2',
    pageNumber: 2,
    imageUrl: "https://picsum.photos/1200/1804",
    date: "2025-11-20",
    status: 'active'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Chief Editor',
    email: 'kingadithya07@gmail.com',
    password: 'Vvrs###98851',
    role: 'admin',
    status: 'active',
    ip: '192.168.1.100',
    joinedAt: '01-01-2023'
  },
  {
    id: 'pub1',
    name: 'Publisher Adithya',
    email: 'admin@gmail.com',
    password: 'Vvrs###98851',
    role: 'publisher',
    status: 'active',
    ip: '192.168.1.105',
    joinedAt: '15-05-2023'
  },
  {
    id: 'sub1',
    name: 'John Reader',
    email: 'reader@example.com',
    password: 'password123',
    role: 'subscriber',
    status: 'active',
    ip: '192.168.1.110',
    joinedAt: '20-11-2025',
    subscriptionPlan: 'free'
  }
];

export const INITIAL_ADS: Advertisement[] = [
    {
        id: 'ad1',
        advertiserName: 'TechCorp Global',
        imageUrl: 'https://picsum.photos/728/90?random=10',
        targetUrl: 'https://example.com',
        size: AdSize.LEADERBOARD,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2030-12-31',
        clicks: 1240,
        clickedIps: []
    },
    {
        id: 'ad2',
        advertiserName: 'Local Coffee Roasters',
        imageUrl: 'https://picsum.photos/300/250?random=11',
        targetUrl: 'https://example.com',
        size: AdSize.RECTANGLE,
        status: 'active',
        startDate: '2024-01-05',
        endDate: '2030-12-31',
        clicks: 850,
        clickedIps: []
    }
];