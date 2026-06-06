import api from './axios.config';

export const poApi = {
  list: (params) => api.get('/purchase-orders', { params }),
  get: (id) => api.get(`/purchase-orders/${id}`),
  downloadPDF: (id) =>
    api.get(`/purchase-orders/${id}/pdf`, { responseType: 'blob' }),
  updateStatus: (id, status) => api.put(`/purchase-orders/${id}/status`, { status }),
};
