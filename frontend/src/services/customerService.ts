import api from './api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_number?: string;
  tax_office?: string;
  created_at: string;
  updated_at: string;
}

export const customerService = {
  getAllCustomers: async () => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  getCustomerById: async (id: number) => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<Customer>('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id: number, customerData: Partial<Customer>) => {
    const response = await api.put<Customer>(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id: number) => {
    await api.delete(`/customers/${id}`);
  }
}; 