import dashboardRepository from '../repositories/dashboard.repository.js';

const getDashboardStats = async () => {
    return dashboardRepository.getStats();
};

export default { getDashboardStats };
