import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { Category } from '../models/Category';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ArticleStatus } from '../types';

/**
 * Get all articles with filters
 * GET /api/articles
 */
export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    tag,
    search,
    author,
    sortBy = 'publishedAt',
    order = 'desc'
  } = req.query;

  const query: any = {};

  // Filter by status (default to published for public)
  if (req.user && (status as string)) {
    query.status = status;
  } else {
    query.status = ArticleStatus.PUBLISHED;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by tag
  if (tag) {
    query.tags = { $in: [new RegExp(tag as string, 'i')] };
  }

  // Filter by author
  if (author) {
    query.author = author;
  }

  // Search in title, content, and tags
  if (search) {
    query.$text = { $search: search as string };
  }

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortQuery: any = {};
  sortQuery[sortBy as string] = sortOrder;

  const [articles, total] = await Promise.all([
    Article.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Article.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total
      }
    }
  });
});

/**
 * Get single article by slug
 * GET /api/articles/:slug
 */
export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug })
    .populate('author', 'name email')
    .populate('category', 'name slug color');

  if (!article) {
    throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
  }

  // Check if article is published or user has access
  if (article.status !== ArticleStatus.PUBLISHED && !req.user) {
    throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
  }

  // Increment view count for published articles
  if (article.status === ArticleStatus.PUBLISHED) {
    article.viewCount += 1;
    await article.save();
  }

  res.json({
    success: true,
    data: { article }
  });
});

/**
 * Create new article
 * POST /api/articles
 */
export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    content,
    summary,
    tags,
    seo,
    category,
    featuredImage,
    pdfUrl,
    status = ArticleStatus.DRAFT
  } = req.body;

  // Verify category exists
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  // Generate unique slug
  const slug = await (Article as any).generateSlug(title);

  // Set publishedAt if status is PUBLISHED
  const publishedAt = status === ArticleStatus.PUBLISHED ? new Date() : undefined;

  const article = await Article.create({
    title,
    slug,
    content,
    summary: summary || [],
    tags: tags || [],
    seo: seo || {},
    status,
    author: req.user!.userId,
    category,
    featuredImage,
    pdfUrl,
    publishedAt
  });

  // Increment category article count if published
  if (status === ArticleStatus.PUBLISHED) {
    categoryDoc.articleCount += 1;
    await categoryDoc.save();
  }

  await article.populate('author', 'name email');
  await article.populate('category', 'name slug color');

  res.status(201).json({
    success: true,
    data: { article },
    message: 'Article created successfully'
  });
});

/**
 * Update article
 * PATCH /api/articles/:id
 */
export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const article = await Article.findById(id);
  if (!article) {
    throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
  }

  // Check permissions
  const isAuthor = article.author.toString() === req.user!.userId;
  const isEditor = ['EDITOR', 'ADMIN'].includes(req.user!.role);
  const isSubEditor = req.user!.role === 'SUB_EDITOR';

  if (!isAuthor && !isEditor) {
    throw new AppError('Not authorized to update this article', 403, 'FORBIDDEN');
  }

  // Sub-editors can only update status to SUB_EDITOR_REVIEW
  if (isSubEditor && !isEditor && updateData.status) {
    if (updateData.status !== ArticleStatus.SUB_EDITOR_REVIEW) {
      throw new AppError('Sub-editors can only submit for review', 403, 'FORBIDDEN');
    }
  }

  // Handle status change
  if (updateData.status && updateData.status !== article.status) {
    // Update category counts if publishing/unpublishing
    if (updateData.status === ArticleStatus.PUBLISHED && !article.publishedAt) {
      updateData.publishedAt = new Date();
      await Category.findByIdAndUpdate(article.category, { $inc: { articleCount: 1 } });
    } else if (article.status === ArticleStatus.PUBLISHED && updateData.status !== ArticleStatus.PUBLISHED) {
      await Category.findByIdAndUpdate(article.category, { $inc: { articleCount: -1 } });
    }
  }

  // Update slug if title changed
  if (updateData.title && updateData.title !== article.title) {
    updateData.slug = await (Article as any).generateSlug(updateData.title);
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('author', 'name email')
    .populate('category', 'name slug color');

  res.json({
    success: true,
    data: { article: updatedArticle },
    message: 'Article updated successfully'
  });
});

/**
 * Delete article
 * DELETE /api/articles/:id
 */
export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await Article.findById(id);
  if (!article) {
    throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
  }

  // Check permissions
  const isAuthor = article.author.toString() === req.user!.userId;
  const isEditor = ['EDITOR', 'ADMIN'].includes(req.user!.role);

  if (!isAuthor && !isEditor) {
    throw new AppError('Not authorized to delete this article', 403, 'FORBIDDEN');
  }

  // Decrement category count if article was published
  if (article.status === ArticleStatus.PUBLISHED) {
    await Category.findByIdAndUpdate(article.category, { $inc: { articleCount: -1 } });
  }

  await Article.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Article deleted successfully'
  });
});

/**
 * Get related articles
 * GET /api/articles/:id/related
 */
export const getRelatedArticles = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;

  const article = await Article.findById(id);
  if (!article) {
    throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
  }

  // Find articles with same category or tags
  const relatedArticles = await Article.find({
    _id: { $ne: id },
    status: ArticleStatus.PUBLISHED,
    $or: [
      { category: article.category },
      { tags: { $in: article.tags } }
    ]
  })
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit as string))
    .lean();

  res.json({
    success: true,
    data: { articles: relatedArticles }
  });
});

/**
 * Get trending articles
 * GET /api/articles/trending
 */
export const getTrendingArticles = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5, days = 7 } = req.query;

  const since = new Date();
  since.setDate(since.getDate() - parseInt(days as string));

  const articles = await Article.find({
    status: ArticleStatus.PUBLISHED,
    publishedAt: { $gte: since }
  })
    .populate('category', 'name slug color')
    .sort({ viewCount: -1, publishedAt: -1 })
    .limit(parseInt(limit as string))
    .lean();

  res.json({
    success: true,
    data: { articles }
  });
});