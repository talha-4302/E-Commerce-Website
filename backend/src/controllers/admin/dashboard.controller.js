import dashboardService from '../../services/dashboard.service.js';
import catchAsync from '../../utils/catchAsync.js';

const getDashboardStats = catchAsync(async (req, res) => {
    const { stats, orderStatus, recentOrders, bestSellers } = await dashboardService.getDashboardStats();
    res.json({ success: true, stats, orderStatus, recentOrders, bestSellers });
});

export { getDashboardStats };
