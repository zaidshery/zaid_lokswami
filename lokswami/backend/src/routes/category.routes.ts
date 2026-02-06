import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Protected routes - only editors and admins can manage categories
router.post('/', authenticate, authorize(UserRole.EDITOR, UserRole.ADMIN), createCategory);
router.patch('/:id', authenticate, authorize(UserRole.EDITOR, UserRole.ADMIN), updateCategory);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteCategory);

export default router;