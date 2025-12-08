import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// ============================================
// Products API
// ============================================
export const productsAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  
  updateStock: async (id, quantity) => {
    const response = await api.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  },
};

// ============================================
// Sales API
// ============================================
export const salesAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/sales', { params: filters });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
  
  create: async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },
  
  update: async (id, saleData) => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },
  
  getStats: async (period = 'month') => {
    const response = await api.get('/sales/stats', { params: { period } });
    return response.data;
  },
};

// ============================================
// Users API
// ============================================
export const usersAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  updatePassword: async (id, passwordData) => {
    const response = await api.patch(`/users/${id}/password`, passwordData);
    return response.data;
  },
};

// ============================================
// Reports API
// ============================================
export const reportsAPI = {
  getRevenue: async (startDate, endDate) => {
    const response = await api.get('/reports/revenue', {
      params: { startDate, endDate },
    });
    return response.data;
  },
  
  getProductAnalytics: async (period = 'month') => {
    const response = await api.get('/reports/products', { params: { period } });
    return response.data;
  },
  
  getSalesAnalytics: async (period = 'month') => {
    const response = await api.get('/reports/sales', { params: { period } });
    return response.data;
  },
  
  getUserPerformance: async (period = 'month') => {
    const response = await api.get('/reports/users', { params: { period } });
    return response.data;
  },
  
  exportReport: async (reportType, format = 'csv') => {
    const response = await api.get(`/reports/export/${reportType}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// Dashboard API
// ============================================
export const dashboardAPI = {
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
  
  getRecentSales: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-sales', { params: { limit } });
    return response.data;
  },
  
  getTopProducts: async (limit = 5) => {
    const response = await api.get('/dashboard/top-products', { params: { limit } });
    return response.data;
  },
  
  getLowStockProducts: async (threshold = 10) => {
    const response = await api.get('/dashboard/low-stock', { params: { threshold } });
    return response.data;
  },
};

export default api;
