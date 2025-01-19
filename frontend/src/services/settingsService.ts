import api from './api';

export interface CompanySettings {
  company_name: string;
  tax_number: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
}

export interface SystemSettings {
  currency: string;
  date_format: string;
  low_stock_threshold: number;
  invoice_prefix: string;
  order_prefix: string;
}

export const settingsService = {
  getCompanySettings: async () => {
    const response = await api.get<CompanySettings>('/settings/company');
    return response.data;
  },

  updateCompanySettings: async (settings: CompanySettings) => {
    const response = await api.put<CompanySettings>('/settings/company', settings);
    return response.data;
  },

  getSystemSettings: async () => {
    const response = await api.get<SystemSettings>('/settings/system');
    return response.data;
  },

  updateSystemSettings: async (settings: SystemSettings) => {
    const response = await api.put<SystemSettings>('/settings/system', settings);
    return response.data;
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/settings/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}; 