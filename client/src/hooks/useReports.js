import { useQuery } from '@tanstack/react-query';
import { reportsApi, activityLogsApi } from '../api/reports.api';

export function useDashboardStats(params) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => reportsApi.dashboard(params).then((r) => r.data.data),
  });
}

export function useSpendTrend(params) {
  return useQuery({
    queryKey: ['spend-trend', params],
    queryFn: () => reportsApi.spendTrend(params).then((r) => r.data.data),
  });
}

export function useVendorPerformanceReport() {
  return useQuery({
    queryKey: ['vendor-performance-report'],
    queryFn: () => reportsApi.vendorPerformance().then((r) => r.data.data),
  });
}

export function useActivityLogs(params) {
  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => activityLogsApi.list(params).then((r) => r.data),
  });
}
