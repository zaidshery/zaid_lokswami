// User Types
export enum UserRole {
  REPORTER = 'REPORTER',
  SUB_EDITOR = 'SUB_EDITOR',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Article Types
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  SUB_EDITOR_REVIEW = 'SUB_EDITOR_REVIEW',
  EDITOR_APPROVED = 'EDITOR_APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface ISEO {
  title: string;
  metaDescription: string;
  keywords: string[];
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string[];
  tags: string[];
  seo: ISEO;
  status: ArticleStatus;
  author: string | IUser;
  category: string | ICategory;
  featuredImage: string;
  pdfUrl?: string;
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Gemini AI Types
export interface GeminiOutput {
  summary: string[];
  tags: string[];
  seo: ISEO;
  translation?: string;
}

export interface SEOOutput {
  title: string;
  metaDescription: string;
  keywords: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  timestamp: string;
}

// Auth Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Media Types
export interface MediaUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

// Workflow Types
export interface StatusChangeLog {
  from: ArticleStatus;
  to: ArticleStatus;
  changedBy: string;
  changedAt: Date;
  note?: string;
}