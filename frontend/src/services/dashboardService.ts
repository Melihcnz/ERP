import api from './api';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  salesByMonth: Array<{
    month: string;
    total: number;
  }>;
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }
}; 