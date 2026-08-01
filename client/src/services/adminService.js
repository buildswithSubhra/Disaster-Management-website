import api from './api';

const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  updateUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};

export default adminService;
