import api from './api';

export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  periodSales: Array<{
    date: string;
    amount: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    quantity: number;
    total_amount: number;
  }>;
  topCustomers: Array<{
    id: number;
    name: string;
    orderCount: number;
    total_amount: number;
  }>;
}

export interface FinanceReport {
  totalRevenue: number;
  totalPendingPayments: number;
  totalOverduePayments: number;
  paymentsByMethod: Record<string, number>;
  recentPayments: Array<{
    id: number;
    invoice_number: string;
    amount: number;
    payment_method: string;
    created_at: string;
  }>;
}

export const reportService = {
  getSalesReport: async (startDate: string, endDate: string) => {
    const response = await api.get<SalesReport>('/reports/sales', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getFinanceReport: async (startDate: string, endDate: string) => {
    const response = await api.get<FinanceReport>('/reports/finance', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  exportSalesReport: async (startDate: string, endDate: string, format: 'pdf' | 'excel') => {
    const response = await api.get(`/reports/sales/export/${format}`, {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  }
}; 