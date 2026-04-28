import express from 'express';
import { authAdmin } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/admin/dashboardController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/admin/orderController.js';
import { addProduct, updateProduct, updateProductStatus } from '../controllers/admin/productController.js';
import { getAllUsers, updateUserStatus } from '../controllers/admin/userController.js';

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

export default adminRouter;
