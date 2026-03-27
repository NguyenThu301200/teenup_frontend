import api from './axios';
import { Parent } from '../types';

export const parentsApi = {
  getAll: (): Promise<Parent[]> => api.get('/parents').then((r) => r.data),
  getOne: (id: number): Promise<Parent> => api.get(`/parents/${id}`).then((r) => r.data),
  create: (data: Omit<Parent, 'id'>): Promise<Parent> => api.post('/parents', data).then((r) => r.data),
  update: (id: number, data: Partial<Parent>): Promise<Parent> => api.patch(`/parents/${id}`, data).then((r) => r.data),
  remove: (id: number): Promise<Parent> => api.delete(`/parents/${id}`).then((r) => r.data),
};
