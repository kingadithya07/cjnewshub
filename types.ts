

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorId?: string; // Tracks the user ID of the creator
  date: string;
  imageUrl: string;
  videoUrl?: string; // Optional video URL
  content: string; // Full content
  tags: string[];
  status: 'draft' | 'published' | 'pending';
  isFeatured: boolean;
  views: number;
}

export interface EPaperPage {
  id: string;
  pageNumber: number;
  imageUrl: string; // Represents the rendered PDF page or uploaded image
  date: string;
  status: 'active' | 'pending';
}

export interface Clipping {
  id: string;
  dataUrl: string;
  timestamp: number;
  userId?: string; // Link clipping to specific user
}

export interface WatermarkSettings {
  text: string;
  logoUrl: string | null;
}

export enum AdSize {
  LEADERBOARD = '728x90',
  RECTANGLE = '300x250',
  SKYSCRAPER = '160x600',
}

export interface Advertisement {
  id: string;
  advertiserName: string;
  imageUrl: string;
  targetUrl: string;
  size: AdSize;
  status: 'active' | 'inactive' | 'pending';
  startDate: string;
  endDate: string;
  clicks: number;
  clickedIps: string[];
}

export interface AdSpot {
  id: string;
  size: AdSize;
  location: string;
}

export type UserRole = 'admin' | 'publisher' | 'subscriber';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text passwords
  status: 'active' | 'blocked' | 'pending';
  ip?: string;
  joinedAt?: string;
  subscriptionPlan?: 'free' | 'premium';
}

export interface RecoveryRequest {
  email: string;
  userName: string;
  code: string;
  timestamp: number;
}

export interface ProfileUpdateRequest {
  userId: string;
  newEmail?: string;
  newPassword?: string;
  verificationCode: string;
  timestamp: number;
}

export interface EmailSettings {
  apiKey: string; // Simulation key
  senderEmail: string;
  companyName: string;
  emailTemplate: string;
}

export interface SubscriptionSettings {
  showPaymentButton: boolean;
  paymentLink: string;
  monthlyPrice: string;
}