import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationsApi } from '../api/registrations';
import toast from 'react-hot-toast';

export function useRegistrations(params?: { studentId?: number | string; classId?: number | string }) {
  return useQuery({
    queryKey: ['registrations', params],
    queryFn: () => registrationsApi.getAll(params),
  });
}

export function useCreateRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrationsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Student registered successfully!');
    },
  });
}

export function useCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrationsApi.cancel,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success(data.refundMessage || 'Registration cancelled');
    },
  });
}
