import api from './axios.config';

export const quotationsApi = {
  submit: (rfqId, data) => api.post(`/rfq/${rfqId}/quotations`, data),
  listForRFQ: (rfqId) => api.get(`/rfq/${rfqId}/quotations`),
  update: (id, data) => api.put(`/quotations/${id}`, data),
  select: (id) => api.post(`/quotations/${id}/select`),
};
