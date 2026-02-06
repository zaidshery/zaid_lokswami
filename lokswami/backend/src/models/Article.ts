import mongoose, { Schema, Document } from 'mongoose';
import { IArticle, ArticleStatus } from '../types';

// FIX IS HERE: We used "Omit" to remove the conflict
export interface IArticleDocument extends Omit<IArticle, '_id'>, Document {
  incrementViews(): Promise<void>;
}

// Model interface for static methods
interface IArticleModel extends mongoose.Model<IArticleDocument> {
  generateSlug(title: string): Promise<string>;
}

const SEOSchema = new Schema({
  title: {
    type: String,
    maxlength: [60, 'SEO title should not exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description should not exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }]
}, { _id: false });

const ArticleSchema = new Schema<IArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    summary: [{
      type: String,
      trim: true
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    seo: {
      type: SEOSchema,
      default: () => ({})
    },
    status: {
      type: String,
      enum: Object.values(ArticleStatus),
      default: ArticleStatus.DRAFT,
      index: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required']
    },
    pdfUrl: {
      type: String
    },
    publishedAt: {
      type: Date,
      index: true
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({ tags: 1, status: 1 });
ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

ArticleSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === ArticleStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

ArticleSchema.statics.generateSlug = async function (title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await this.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

ArticleSchema.methods.incrementViews = async function (): Promise<void> {
  const article = this as unknown as IArticleDocument;
  article.viewCount += 1;
  await article.save();
};

export const Article = mongoose.model<IArticleDocument, IArticleModel>('Article', ArticleSchema);