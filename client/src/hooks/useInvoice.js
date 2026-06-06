import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from '../api/invoices.api';
import toast from 'react-hot-toast';

export function useInvoices(params) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoicesApi.list(params).then((r) => r.data),
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => invoicesApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice generated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to generate invoice');
    },
  });
}

export function useUpdateInvoiceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => invoicesApi.updateStatus(id, status).then((r) => r.data.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoice', id] });
      toast.success('Invoice status updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to update status');
    },
  });
}

export function useSendInvoiceEmail() {
  return useMutation({
    mutationFn: (id) => invoicesApi.sendEmail(id).then((r) => r.data),
    onSuccess: () => toast.success('Invoice sent via email'),
    onError: () => toast.error('Failed to send email'),
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: async (id) => {
      const res = await invoicesApi.downloadPDF(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error('PDF download failed'),
  });
}
