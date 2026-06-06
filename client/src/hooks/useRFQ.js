import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi } from '../api/rfq.api';
import { quotationsApi } from '../api/quotations.api';
import toast from 'react-hot-toast';

export function useRFQs(params) {
  return useQuery({
    queryKey: ['rfqs', params],
    queryFn: () => rfqApi.list(params).then((r) => r.data),
  });
}

export function useRFQ(id) {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateRFQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => rfqApi.create(formData).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfqs'] });
      toast.success('RFQ created and vendors notified');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to create RFQ');
    },
  });
}

export function useCloseRFQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => rfqApi.close(id).then((r) => r.data.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['rfqs'] });
      qc.invalidateQueries({ queryKey: ['rfq', id] });
      toast.success('RFQ closed');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to close RFQ');
    },
  });
}

export function useQuotationsForRFQ(rfqId) {
  return useQuery({
    queryKey: ['quotations', rfqId],
    queryFn: () => quotationsApi.listForRFQ(rfqId).then((r) => r.data.data),
    enabled: !!rfqId,
  });
}

export function useSubmitQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rfqId, data }) => quotationsApi.submit(rfqId, data).then((r) => r.data.data),
    onSuccess: (_, { rfqId }) => {
      qc.invalidateQueries({ queryKey: ['quotations', rfqId] });
      qc.invalidateQueries({ queryKey: ['rfq', rfqId] });
      toast.success('Quotation submitted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to submit quotation');
    },
  });
}

export function useSelectQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => quotationsApi.select(id).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotations'] });
      qc.invalidateQueries({ queryKey: ['approvals'] });
      toast.success('Quotation selected — approval request sent to manager');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to select quotation');
    },
  });
}
