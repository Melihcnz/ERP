import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  last_login?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserData) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },

  changePassword: async (id: number, currentPassword: string, newPassword: string) => {
    await api.post(`/users/${id}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }
}; 