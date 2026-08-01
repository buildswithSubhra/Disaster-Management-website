import api from './api';

const disasterService = {
  createDisaster: async (disasterData) => {
    const formData = new FormData();
    Object.keys(disasterData).forEach(key => {
      if (key === 'image' && disasterData[key]) {
        formData.append('image', disasterData[key]);
      } else if (disasterData[key] !== undefined && disasterData[key] !== null) {
        formData.append(key, disasterData[key]);
      }
    });
    const response = await api.post('/disasters', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getAllDisasters: async (params = {}) => {
    const response = await api.get('/disasters', { params });
    return response.data;
  },
  getMyDisasters: async (params = {}) => {
    const response = await api.get('/disasters/my', { params });
    return response.data;
  },
  getDisasterById: async (id) => {
    const response = await api.get(`/disasters/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/disasters/${id}/status`, { status });
    return response.data;
  },
  assignRescuer: async (disasterId, rescuerId) => {
    const response = await api.put(`/disasters/${disasterId}/assign`, { rescuerId });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/disasters/stats/dashboard');
    return response.data;
  },
  deleteDisaster: async (id) => {
    const response = await api.delete(`/disasters/${id}`);
    return response.data;
  },
};

export default disasterService;
