import api from './api';

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  total_amount: number;
  due_date: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  created_at: string;
  order: {
    id: number;
    customer: {
      id: number;
      name: string;
    };
  };
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  created_at: string;
}

export const financeService = {
  // Fatura işlemleri
  createInvoice: async (data: { order_id: number; invoice_number: string; due_date: string }) => {
    const response = await api.post<Invoice>('/invoices', data);
    return response.data;
  },

  getAllInvoices: async () => {
    const response = await api.get<Invoice[]>('/invoices');
    return response.data;
  },

  // Ödeme işlemleri
  recordPayment: async (data: {
    invoice_id: number;
    amount: number;
    payment_method: string;
    payment_reference?: string;
  }) => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  getPaymentsByInvoice: async (invoiceId: number) => {
    const response = await api.get<Payment[]>(`/payments/invoice/${invoiceId}`);
    return response.data;
  }
}; 