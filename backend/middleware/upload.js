import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ezshop-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{
            width: 1000,
            height: 1000,
            crop: 'limit',
            quality: 'auto'
        }]
    }
});

// Create multer upload instance
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB limit
    }
});

// Export cloudinary for migration script
export default cloudinary;
