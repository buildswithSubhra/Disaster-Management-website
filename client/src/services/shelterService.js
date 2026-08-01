import api from './api';

const shelterService = {
  getAllShelters: async (params = {}) => {
    const response = await api.get('/shelters', { params });
    return response.data;
  },
  getShelterById: async (id) => {
    const response = await api.get(`/shelters/${id}`);
    return response.data;
  },
  getNearbyShelters: async (lat, lng, maxDistance = 500) => {
    const response = await api.get('/shelters/nearby', { params: { lat, lng, maxDistance } });
    return response.data;
  },
  createShelter: async (data) => {
    const response = await api.post('/shelters', data);
    return response.data;
  },
  updateShelter: async (id, data) => {
    const response = await api.put(`/shelters/${id}`, data);
    return response.data;
  },
  deleteShelter: async (id) => {
    const response = await api.delete(`/shelters/${id}`);
    return response.data;
  },
};

export default shelterService;
