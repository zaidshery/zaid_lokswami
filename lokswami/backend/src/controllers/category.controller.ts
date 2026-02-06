import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { includeCount = true } = req.query;

  const categories = await Category.find()
    .sort({ name: 1 })
    .lean();

  res.json({
    success: true,
    data: { categories }
  });
});

/**
 * Get single category by slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  res.json({
    success: true,
    data: { category }
  });
});

/**
 * Create new category
 * POST /api/categories
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, color } = req.body;

  // Check if category with same slug exists
  const existingCategory = await Category.findOne({ slug: slug.toLowerCase() });
  if (existingCategory) {
    throw new AppError('Category with this slug already exists', 409, 'CATEGORY_EXISTS');
  }

  const category = await Category.create({
    name,
    slug: slug.toLowerCase(),
    description,
    color
  });

  res.status(201).json({
    success: true,
    data: { category },
    message: 'Category created successfully'
  });
});

/**
 * Update category
 * PATCH /api/categories/:id
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, color } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, description, color },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: { category: updatedCategory },
    message: 'Category updated successfully'
  });
});

/**
 * Delete category
 * DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  // Check if category has articles
  if (category.articleCount > 0) {
    throw new AppError(
      'Cannot delete category with articles. Please reassign or delete articles first.',
      400,
      'CATEGORY_HAS_ARTICLES'
    );
  }

  await Category.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});