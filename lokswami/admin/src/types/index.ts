// User Types
export enum UserRole {
  REPORTER = 'REPORTER',
  SUB_EDITOR = 'SUB_EDITOR',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Article Types
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  SUB_EDITOR_REVIEW = 'SUB_EDITOR_REVIEW',
  EDITOR_APPROVED = 'EDITOR_APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export const statusLabels: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'ड्राफ्ट',
  [ArticleStatus.SUB_EDITOR_REVIEW]: 'सब-एडिटर रिव्यू',
  [ArticleStatus.EDITOR_APPROVED]: 'एडिटर अप्रूव्ड',
  [ArticleStatus.PUBLISHED]: 'प्रकाशित',
  [ArticleStatus.ARCHIVED]: 'अभिलेखित'
};

export const statusColors: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'bg-gray-100 text-gray-700 border-gray-300',
  [ArticleStatus.SUB_EDITOR_REVIEW]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [ArticleStatus.EDITOR_APPROVED]: 'bg-blue-100 text-blue-700 border-blue-300',
  [ArticleStatus.PUBLISHED]: 'bg-green-100 text-green-700 border-green-300',
  [ArticleStatus.ARCHIVED]: 'bg-gray-100 text-gray-500 border-gray-300'
};

export interface SEO {
  title: string;
  metaDescription: string;
  keywords: string[];
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string[];
  tags: string[];
  seo: SEO;
  status: ArticleStatus;
  author: User;
  category: Category;
  featuredImage: string;
  pdfUrl?: string;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

// AI Types
export interface AIOutput {
  summary: string[];
  tags: string[];
  seo: SEO;
  translation?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  articles: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Dashboard Stats
export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  recentArticles: Article[];
}