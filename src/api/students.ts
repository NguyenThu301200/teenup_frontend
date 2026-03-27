import api from './axios';
import { Student } from '../types';

export const studentsApi = {
  getAll: (): Promise<Student[]> => api.get('/students').then((r) => r.data),
  getOne: (id: number): Promise<Student> => api.get(`/students/${id}`).then((r) => r.data),
  create: (data: Omit<Student, 'id' | 'parent'>): Promise<Student> => api.post('/students', data).then((r) => r.data),
  update: (id: number, data: Partial<Student>): Promise<Student> => api.patch(`/students/${id}`, data).then((r) => r.data),
  remove: (id: number): Promise<Student> => api.delete(`/students/${id}`).then((r) => r.data),
};
