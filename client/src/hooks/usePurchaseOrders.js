import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poApi } from '../api/po.api';
import toast from 'react-hot-toast';

export function usePurchaseOrders(params) {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => poApi.list(params).then((r) => r.data),
  });
}

export function usePurchaseOrder(id) {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => poApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useUpdatePOStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => poApi.updateStatus(id, status).then((r) => r.data.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      qc.invalidateQueries({ queryKey: ['purchase-order', id] });
      toast.success('PO status updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to update status');
    },
  });
}

export function useDownloadPO() {
  return useMutation({
    mutationFn: async (id) => {
      const res = await poApi.downloadPDF(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `PO-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error('PDF download failed'),
  });
}
