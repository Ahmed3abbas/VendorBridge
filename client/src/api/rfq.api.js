import api from './axios.config';

export const rfqApi = {
  list: (params) => api.get('/rfq', { params }),
  get: (id) => api.get(`/rfq/${id}`),
  create: (formData) =>
    api.post('/rfq', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/rfq/${id}`, data),
  close: (id) => api.post(`/rfq/${id}/close`),
};
