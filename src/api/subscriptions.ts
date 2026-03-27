import api from './axios';
import { Subscription } from '../types';

export const subscriptionsApi = {
  getAll: (): Promise<Subscription[]> => api.get('/subscriptions').then((r) => r.data),
  getOne: (id: number): Promise<Subscription> => api.get(`/subscriptions/${id}`).then((r) => r.data),
  getByStudent: (studentId: number): Promise<Subscription[]> => api.get(`/subscriptions/student/${studentId}`).then((r) => r.data),
  create: (data: Omit<Subscription, 'id' | 'status' | 'remainingSessions'>): Promise<Subscription> => api.post('/subscriptions', data).then((r) => r.data),
  cancel: (id: number): Promise<Subscription> => api.patch(`/subscriptions/${id}/cancel`).then((r) => r.data),
  remove: (id: number): Promise<Subscription> => api.delete(`/subscriptions/${id}`).then((r) => r.data),
};
