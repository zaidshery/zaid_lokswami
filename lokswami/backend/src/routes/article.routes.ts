import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getRelatedArticles,
  getTrendingArticles
} from '../controllers/article.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/trending', getTrendingArticles);
router.get('/', optionalAuth, getArticles);
router.get('/:slug', optionalAuth, getArticleBySlug);
router.get('/:id/related', getRelatedArticles);

// Protected routes
router.post('/', authenticate, authorize(UserRole.REPORTER, UserRole.SUB_EDITOR, UserRole.EDITOR, UserRole.ADMIN), createArticle);
router.patch('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;