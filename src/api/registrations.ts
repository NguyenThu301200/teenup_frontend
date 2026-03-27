import api from './axios';
import { Registration } from '../types';

export const registrationsApi = {
  getAll: (params?: { studentId?: string | number, classId?: string | number }): Promise<Registration[]> => {
    const query: Record<string, string | number> = {};
    if (params?.studentId) query.studentId = params.studentId;
    if (params?.classId) query.classId = params.classId;
    return api.get('/class-registrations', { params: query }).then((r) => r.data);
  },
  getOne: (id: number): Promise<Registration> => api.get(`/class-registrations/${id}`).then((r) => r.data),
  create: (data: Omit<Registration, 'id' | 'status' | 'student' | 'class' | 'subscription'>): Promise<Registration> => api.post('/class-registrations', data).then((r) => r.data),
  cancel: (id: number): Promise<Registration & { refundMessage?: string }> => api.patch(`/class-registrations/${id}/cancel`).then((r) => r.data),
};
