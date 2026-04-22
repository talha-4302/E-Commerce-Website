import express from 'express';
import { listProducts, getProductById, getLatestProducts } from '../controllers/productController.js';

const productRouter = express.Router();

// IMPORTANT: /latest must be registered BEFORE /single/:id
// Otherwise Express would treat the string "latest" as the :id param.
productRouter.get('/list', listProducts);
productRouter.get('/latest', getLatestProducts);
productRouter.get('/single/:id', getProductById);

export default productRouter;
