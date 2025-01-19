import api from './api';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  unit_price: number;
  stock_quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export const productService = {
  getAllProducts: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  getLowStockProducts: async () => {
    const response = await api.get<Product[]>('/products/low-stock');
    return response.data;
  }
}; 