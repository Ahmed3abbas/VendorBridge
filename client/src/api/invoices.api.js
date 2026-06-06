import api from './axios.config';

export const invoicesApi = {
  create: (data) => api.post('/invoices', data),
  list: (params) => api.get('/invoices', { params }),
  get: (id) => api.get(`/invoices/${id}`),
  downloadPDF: (id) =>
    api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  sendEmail: (id) => api.post(`/invoices/${id}/send-email`),
  updateStatus: (id, status) => api.put(`/invoices/${id}/status`, { status }),
};
