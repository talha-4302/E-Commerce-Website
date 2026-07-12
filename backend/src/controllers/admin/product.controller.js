import productService from '../../services/product.service.js';
import catchAsync from '../../utils/catchAsync.js';

const addProduct = catchAsync(async (req, res) => {
    const productId = await productService.addProduct(req.body);
    res.json({ success: true, message: "Product added successfully", productId });
});

const updateProduct = catchAsync(async (req, res) => {
    await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, message: "Product updated successfully" });
});

const updateProductStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    await productService.updateProductStatus(req.params.id, status);
    res.json({ success: true, message: `Product status updated to '${status}'` });
});

export { addProduct, updateProduct, updateProductStatus };
