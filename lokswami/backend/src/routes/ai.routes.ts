import { Router } from 'express';
import {
  summarizeArticle,
  suggestTags,
  generateSEO,
  translateContent,
  completeAIAssist
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// All AI routes require authentication and have rate limiting
router.use(authenticate);
router.use(aiLimiter);

// AI endpoints
router.post('/summarize', summarizeArticle);
router.post('/tags', suggestTags);
router.post('/seo', generateSEO);
router.post('/translate', translateContent);
router.post('/complete', completeAIAssist);

export default router;