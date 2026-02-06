import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types';

// FIX: We specifically import 'Document' above so this line works
export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {
  isActive: boolean;
}

// FIX: We use 'any' to stop the strict type checking errors
const CategorySchema = new Schema<any>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    color: {
      type: String,
      default: '#000000',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CategorySchema.index({ slug: 1 });

// export const Category = mongoose.model<ICategoryDocument>('Category', CategorySchema);
// // this is nitpicking but we should export the interface as well for use in other parts of the codebase
// export type { ICategoryDocument as ICategory };


// FIX: We need to export the model and the interface correctly
const Category = mongoose.model<ICategoryDocument>('Category', CategorySchema);
export { Category, ICategoryDocument as ICategory };
