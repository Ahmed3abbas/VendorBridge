import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '../api/vendors.api';
import toast from 'react-hot-toast';

export function useVendors(params) {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: () => vendorsApi.list(params).then((r) => r.data),
  });
}

export function useVendor(id) {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorsApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useVendorPerformance(id) {
  return useQuery({
    queryKey: ['vendor-performance', id],
    queryFn: () => vendorsApi.performance(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => vendorsApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor created successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to create vendor');
    },
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => vendorsApi.update(id, data).then((r) => r.data.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['vendors'] });
      qc.invalidateQueries({ queryKey: ['vendor', id] });
      toast.success('Vendor updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to update vendor');
    },
  });
}
