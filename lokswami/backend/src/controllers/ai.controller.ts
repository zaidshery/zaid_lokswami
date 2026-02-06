import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Summarize article content
 * POST /api/ai/summarize
 */
export const summarizeArticle = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a string',
      code: 'INVALID_CONTENT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (content.length < 50) {
    res.status(400).json({
      success: false,
      error: 'Content must be at least 50 characters long',
      code: 'CONTENT_TOO_SHORT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const summary = await geminiService.summarizeArticle(content);

  res.json({
    success: true,
    data: { summary },
    message: 'Article summarized successfully'
  });
});

/**
 * Suggest tags for article
 * POST /api/ai/tags
 */
export const suggestTags = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a string',
      code: 'INVALID_CONTENT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const tags = await geminiService.suggestTags(content);

  res.json({
    success: true,
    data: { tags },
    message: 'Tags suggested successfully'
  });
});

/**
 * Generate SEO metadata
 * POST /api/ai/seo
 */
export const generateSEO = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Title is required and must be a string',
      code: 'INVALID_TITLE',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (!content || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a string',
      code: 'INVALID_CONTENT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const seo = await geminiService.generateSEO(title, content);

  res.json({
    success: true,
    data: { seo },
    message: 'SEO metadata generated successfully'
  });
});

/**
 * Translate content
 * POST /api/ai/translate
 */
export const translateContent = asyncHandler(async (req: Request, res: Response) => {
  const { content, direction } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a string',
      code: 'INVALID_CONTENT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (!direction || !['HI_TO_EN', 'EN_TO_HI'].includes(direction)) {
    res.status(400).json({
      success: false,
      error: 'Direction must be either HI_TO_EN or EN_TO_HI',
      code: 'INVALID_DIRECTION',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const translation = await geminiService.translate(content, direction);

  res.json({
    success: true,
    data: { translation },
    message: 'Content translated successfully'
  });
});

/**
 * Complete AI assistant - all features at once
 * POST /api/ai/complete
 */
export const completeAIAssist = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Title is required and must be a string',
      code: 'INVALID_TITLE',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (!content || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a string',
      code: 'INVALID_CONTENT',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const result = await geminiService.completeAIAssist(title, content);

  res.json({
    success: true,
    data: result,
    message: 'AI assistance completed successfully'
  });
});