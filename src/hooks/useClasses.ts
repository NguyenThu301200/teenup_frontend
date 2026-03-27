import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes';
import { Class } from '../types';
import toast from 'react-hot-toast';

export function useClasses(dayOfWeek?: string) {
  return useQuery({
    queryKey: ['classes', dayOfWeek],
    queryFn: () => classesApi.getAll(dayOfWeek),
  });
}

export function useClass(id: number) {
  return useQuery({
    queryKey: ['classes', 'detail', id],
    queryFn: () => classesApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully');
    },
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Class> }) => classesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully');
    },
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: classesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully');
    },
  });
}
