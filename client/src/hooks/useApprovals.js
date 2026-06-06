import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../api/approvals.api';
import toast from 'react-hot-toast';

export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: () => approvalsApi.listPending().then((r) => r.data.data),
  });
}

export function useApproval(id) {
  return useQuery({
    queryKey: ['approval', id],
    queryFn: () => approvalsApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useApproveQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }) => approvalsApi.approve(id, remarks).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals'] });
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Approved — Purchase Order generated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to approve');
    },
  });
}

export function useRejectQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }) => approvalsApi.reject(id, remarks).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals'] });
      toast.success('Quotation rejected');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to reject');
    },
  });
}
