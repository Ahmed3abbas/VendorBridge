import api from './axios.config';

export const reportsApi = {
  dashboard: (params) => api.get('/reports/dashboard', { params }),
  spendTrend: (params) => api.get('/reports/spend-trend', { params }),
  vendorPerformance: () => api.get('/reports/vendor-performance'),
};

export const activityLogsApi = {
  list: (params) => api.get('/activity-logs', { params }),
};
