import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentsApi } from '../api/parents';
import { Parent } from '../types';
import toast from 'react-hot-toast';

export function useParents() {
  return useQuery({ queryKey: ['parents'], queryFn: parentsApi.getAll });
}

export function useParent(id: number) {
  return useQuery({
    queryKey: ['parents', id],
    queryFn: () => parentsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent created successfully');
    },
  });
}

export function useUpdateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Parent> }) => parentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent updated successfully');
    },
  });
}

export function useDeleteParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent deleted successfully');
    },
  });
}
