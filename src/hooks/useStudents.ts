import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { Student } from '../types';
import toast from 'react-hot-toast';

export function useStudents() {
  return useQuery({ queryKey: ['students'], queryFn: studentsApi.getAll });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created successfully');
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Student> }) => studentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
  });
}
