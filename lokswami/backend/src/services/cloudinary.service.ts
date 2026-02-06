import { v2 as cloudinary } from 'cloudinary';
import { MediaUploadResult } from '../types';

export class CloudinaryService {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    filePath: string,
    folder: string = 'lokswami/images',
    options: {
      transformation?: object;
      eager?: object[];
    } = {}
  ): Promise<MediaUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        transformation: {
          quality: 'auto:good',
          fetch_format: 'auto',
          ...options.transformation
        },
        eager: options.eager || [
          { width: 400, height: 225, crop: 'fill', quality: 'auto' }, // Thumbnail
          { width: 800, height: 450, crop: 'fill', quality: 'auto' }, // Featured
          { width: 1200, height: 675, crop: 'fill', quality: 'auto' } // Hero
        ],
        eager_async: true
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary image upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Upload PDF to Cloudinary
   */
  async uploadPDF(
    filePath: string,
    folder: string = 'lokswami/epapers'
  ): Promise<MediaUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'raw',
        format: 'pdf'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary PDF upload error:', error);
      throw new Error('Failed to upload PDF to Cloudinary');
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete file from Cloudinary');
    }
  }

  /**
   * Generate optimized image URL
   */
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
    } = {}
  ): string {
    const { width, height, crop = 'fill', quality = 'auto' } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: 'auto',
      secure: true
    });
  }

  /**
   * Get upload signature for direct client uploads
   */
  getUploadSignature(params: object = {}): {
    signature: string;
    timestamp: number;
    apiKey: string;
  } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, ...params },
      apiSecret
    );

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY!
    };
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();