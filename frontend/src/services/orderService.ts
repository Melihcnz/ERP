import api from './api';

export interface OrderItem {
  product_id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  customer_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
  }>;
}

export const orderService = {
  createOrder: async (orderData: CreateOrderData) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: Order['status']) => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }
}; 