import express from 'express';
import { addProduct, updateProduct, updateProductStatus } from '../../controllers/admin/product.controller.js';

const router = express.Router();

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.put('/products/:id/status', updateProductStatus);

export default router;
