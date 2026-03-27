import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptions';
import toast from 'react-hot-toast';

export function useSubscriptions() {
  return useQuery({ queryKey: ['subscriptions'], queryFn: subscriptionsApi.getAll });
}

export function useSubscription(id: number) {
  return useQuery({
    queryKey: ['subscriptions', id],
    queryFn: () => subscriptionsApi.getOne(id),
    enabled: !!id,
  });
}

export function useStudentSubscriptions(studentId: number) {
  return useQuery({
    queryKey: ['subscriptions', 'student', studentId],
    queryFn: () => subscriptionsApi.getByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created successfully');
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription cancelled');
    },
  });
}
