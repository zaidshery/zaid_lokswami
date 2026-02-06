import axios from 'axios';
import { getAuthToken } from '@/stores/auth.store';
import { 
  ApiResponse, 
  Article, 
  Category, 
  PaginatedResponse, 
  AIOutput, 
  User, 
  DashboardStats 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ====================
// Auth API
// ====================

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>('/auth/login', { email, password }),

  getMe: () =>
    apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
};

// ====================
// Articles API
// ====================

export const articlesAPI = {
  getArticles: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Article>>>('/articles', { params }),

  getArticleById: (id: string) =>
    apiClient.get<ApiResponse<{ article: Article }>>(`/articles/${id}`),

  createArticle: (data: Partial<Article>) =>
    apiClient.post<ApiResponse<{ article: Article }>>('/articles', data),

  updateArticle: (id: string, data: Partial<Article>) =>
    apiClient.patch<ApiResponse<{ article: Article }>>(`/articles/${id}`, data),

  deleteArticle: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/articles/${id}`)
};

// ====================
// Categories API
// ====================

export const categoriesAPI = {
  getCategories: () =>
    apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories'),

  createCategory: (data: Partial<Category>) =>
    apiClient.post<ApiResponse<{ category: Category }>>('/categories', data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.patch<ApiResponse<{ category: Category }>>(`/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/categories/${id}`)
};

// ====================
// AI API
// ====================

export const aiAPI = {
  summarizeArticle: (content: string) =>
    apiClient.post<ApiResponse<{ summary: string[] }>>('/ai/summarize', { content }),

  suggestTags: (content: string) =>
    apiClient.post<ApiResponse<{ tags: string[] }>>('/ai/tags', { content }),

  generateSEO: (title: string, content: string) =>
    apiClient.post<ApiResponse<{ seo: { title: string; metaDescription: string; keywords: string[] } }>>('/ai/seo', { title, content }),

  completeAssist: (title: string, content: string) =>
    apiClient.post<ApiResponse<AIOutput>>('/ai/complete', { title, content })
};

// ====================
// Dashboard API
// ====================

export const dashboardAPI = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats')
};

export default apiClient;