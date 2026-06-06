import api from './axios.config';

export const approvalsApi = {
  listPending: () => api.get('/approvals'),
  get: (id) => api.get(`/approvals/${id}`),
  approve: (id, remarks) => api.post(`/approvals/${id}/approve`, { remarks }),
  reject: (id, remarks) => api.post(`/approvals/${id}/reject`, { remarks }),
};
