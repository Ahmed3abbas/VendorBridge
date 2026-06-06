import api from './axios.config';

export const vendorsApi = {
  list: (params) => api.get('/vendors', { params }),
  get: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  performance: (id) => api.get(`/vendors/${id}/performance`),
};
