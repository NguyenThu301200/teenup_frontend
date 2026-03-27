import api from './axios';
import { Class } from '../types';

export const classesApi = {
  getAll: (dayOfWeek?: string): Promise<Class[]> => {
    const params = dayOfWeek ? { dayOfWeek } : {};
    return api.get('/classes', { params }).then((r) => r.data);
  },
  getOne: (id: number): Promise<Class> => api.get(`/classes/${id}`).then((r) => r.data),
  create: (data: Omit<Class, 'id' | 'classRegistrations'>): Promise<Class> => api.post('/classes', data).then((r) => r.data),
  update: (id: number, data: Partial<Class>): Promise<Class> => api.patch(`/classes/${id}`, data).then((r) => r.data),
  remove: (id: number): Promise<Class> => api.delete(`/classes/${id}`).then((r) => r.data),
};
