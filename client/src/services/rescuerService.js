import api from './api';

const rescuerService = {
  getAllRescuers: async (params = {}) => {
    const response = await api.get('/rescuers', { params });
    return response.data;
  },
  getRescuerProfile: async () => {
    const response = await api.get('/rescuers/profile');
    return response.data;
  },
  createRescuer: async (data) => {
    const response = await api.post('/rescuers', data);
    return response.data;
  },
  updateRescuer: async (id, data) => {
    const response = await api.put(`/rescuers/${id}`, data);
    return response.data;
  },
  deleteRescuer: async (id) => {
    const response = await api.delete(`/rescuers/${id}`);
    return response.data;
  },
  updateAvailability: async (availability) => {
    const response = await api.put('/rescuers/availability', { availability });
    return response.data;
  },
  updateLocation: async (data) => {
    const response = await api.put('/rescuers/location', data);
    return response.data;
  },
  getAssignedMissions: async () => {
    const response = await api.get('/rescuers/missions');
    return response.data;
  },
  updateMissionProgress: async (id, status) => {
    const response = await api.put(`/rescuers/missions/${id}/progress`, { status });
    return response.data;
  },
};

export default rescuerService;
