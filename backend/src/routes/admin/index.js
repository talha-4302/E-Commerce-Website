import express from 'express';
import { authAdmin } from '../../middleware/auth.js';
import dashboardRoutes from './dashboard.routes.js';
import orderRoutes from './order.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';

const adminRouter = express.Router();

// Every /api/admin/* route requires admin auth.
adminRouter.use(authAdmin);

adminRouter.use(dashboardRoutes);
adminRouter.use(orderRoutes);
adminRouter.use(productRoutes);
adminRouter.use(userRoutes);

export default adminRouter;
