import productService from '../services/product.service.js';
import catchAsync from '../utils/catchAsync.js';

const listProducts = catchAsync(async (req, res) => {
    const { products, pagination } = await productService.listProducts(req.query);
    res.json({ success: true, products, pagination });
});

const getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
});

const getLatestProducts = catchAsync(async (req, res) => {
    const products = await productService.getLatestProducts();
    res.json({ success: true, products });
});

export { listProducts, getProductById, getLatestProducts };
