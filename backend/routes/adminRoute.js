import express from 'express';
import { authAdmin } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/admin/dashboardController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/admin/orderController.js';
import { addProduct, updateProduct, updateProductStatus } from '../controllers/admin/productController.js';
import { getAllUsers, updateUserStatus } from '../controllers/admin/userController.js';
import { upload } from '../middleware/upload.js';

const adminRouter = express.Router();

// Dashboard
adminRouter.get('/dashboard', authAdmin, getDashboardStats);

// Orders
adminRouter.get('/orders', authAdmin, getAllOrders);
adminRouter.put('/orders/:id/status', authAdmin, updateOrderStatus);

// Products
adminRouter.post('/products', authAdmin, addProduct);
adminRouter.put('/products/:id', authAdmin, updateProduct);
adminRouter.put('/products/:id/status', authAdmin, updateProductStatus);

// Users
adminRouter.get('/users', authAdmin, getAllUsers);
adminRouter.put('/users/:id/status', authAdmin, updateUserStatus);

// Image upload endpoint
adminRouter.post('/upload-image', authAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
});

export default adminRouter;
