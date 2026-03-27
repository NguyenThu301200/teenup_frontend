import { useState, useMemo, FormEvent } from 'react';
import { useRegistrations, useCreateRegistration, useCancelRegistration } from '../hooks/useRegistrations';
import { useStudents } from '../hooks/useStudents';
import { useStudentSubscriptions } from '../hooks/useSubscriptions';
import { useClasses } from '../hooks/useClasses';
import LoadingSpinner from '../components/LoadingSpinner';
import { ClipboardDocumentListIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { Class } from '../types';

export default function Registrations() {
  const [filterStudentId, setFilterStudentId] = useState<string>('');
  const { data: registrations, isLoading: loadingRegs } = useRegistrations({ 
    studentId: filterStudentId || undefined 
  });
  
  const { data: students } = useStudents();
  const { data: classes } = useClasses();
  const createMutation = useCreateRegistration();
  const cancelMutation = useCancelRegistration();

  const [form, setForm] = useState({
    studentId: '',
    subscriptionId: '',
    classId: '',
    classDate: '',
  });

  const { data: studentSubscriptions, isLoading: loadingSubs } = useStudentSubscriptions(
    form.studentId ? parseInt(form.studentId) : 0
  );

  const activeSubscriptions = useMemo(() => {
    return (studentSubscriptions || []).filter(
      (s) => s.status === 'ACTIVE' && s.remainingSessions > 0 && dayjs().isBefore(dayjs(s.endDate).add(1, 'day'))
    );
  }, [studentSubscriptions]);

  const selectedClass = useMemo(() => {
    return classes?.find((c) => c.id === parseInt(form.classId));
  }, [classes, form.classId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        studentId: parseInt(form.studentId),
        subscriptionId: parseInt(form.subscriptionId),
        classId: parseInt(form.classId),
        classDate: new Date(form.classDate).toISOString(),
      },
      {
        onSuccess: () => {
          setForm({ ...form, classId: '', classDate: '' });
        },
      }
    );
  };

  const handleCancel = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this registration? Registrations cancelled >24h before class start will be refunded.')) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Class Registration</h1>
          <p className="text-sm text-surface-500 mt-1">Register students to class sessions</p>
        </div>
      </div>

      <div className="card p-5 lg:p-6 bg-white border-primary-100 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Register Student</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-surface-700 mb-1">Student</label>
            <select
              required
              value={form.studentId}
              onChange={(e) => setForm({ studentId: e.target.value, subscriptionId: '', classId: '', classDate: '' })}
              className="input-field"
            >
              <option value="">Select student...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-surface-700 mb-1">Subscription</label>
            <select
              required
              disabled={!form.studentId || loadingSubs || activeSubscriptions.length === 0}
              value={form.subscriptionId}
              onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })}
              className="input-field disabled:bg-surface-50 disabled:text-surface-400"
            >
              <option value="">
                {!form.studentId ? 'Select student first' : activeSubscriptions.length === 0 ? 'No active subscriptions' : 'Select subscription...'}
              </option>
              {activeSubscriptions.map((s) => (
                <option key={s.id} value={s.id}>
                  ID {s.id} ({s.remainingSessions} sessions left)
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-surface-700 mb-1">Class</label>
            <select
              required
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value, classDate: '' })}
              className="input-field"
            >
              <option value="">Select class...</option>
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                const dayClasses = classes?.filter((c) => c.dayOfWeek === day);
                if (!dayClasses?.length) return null;
                return (
                  <optgroup key={day} label={day}>
                    {dayClasses.map((c: Class) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.startTime}-{c.endTime})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Class Date {selectedClass && <span className="text-primary-600 font-normal">({selectedClass.dayOfWeek})</span>}
            </label>
            <input
              type="date"
              required
              disabled={!form.classId}
              value={form.classDate}
              onChange={(e) => setForm({ ...form, classDate: e.target.value })}
              className="input-field disabled:bg-surface-50"
            />
          </div>

          <div className="lg:col-span-1">
            <button
              type="submit"
              disabled={createMutation.isPending || !form.studentId || !form.subscriptionId || !form.classId || !form.classDate}
              className="btn-primary w-full h-[42px]"
            >
              {createMutation.isPending ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden mt-8">
        <div className="px-5 py-4 border-b border-surface-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-50">
          <h2 className="text-base font-semibold text-surface-900">Registration History</h2>
          <select
            value={filterStudentId}
            onChange={(e) => setFilterStudentId(e.target.value)}
            className="input-field sm:w-64 bg-white"
          >
            <option value="">All Students</option>
            {students?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {loadingRegs ? (
          <LoadingSpinner />
        ) : registrations?.length === 0 ? (
          <div className="p-12 text-center text-surface-400">No registrations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-surface-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Date & Class</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 bg-white">
                {registrations?.map((reg) => {
                  const classDateTime = dayjs(reg.classDate).hour(parseInt(reg.class?.startTime.split(':')[0] || '0')).minute(parseInt(reg.class?.startTime.split(':')[1] || '0'));
                  const isFuture = classDateTime.isAfter(dayjs());
                  
                  return (
                    <tr key={reg.id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                            <ClipboardDocumentListIcon className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-900">
                              {dayjs(reg.classDate).format('ddd, DD MMM YYYY')}
                            </p>
                            <p className="text-xs text-primary-600 font-medium mt-0.5">
                              {reg.class?.name} ({reg.class?.startTime}-{reg.class?.endTime})
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-surface-800 font-medium">{reg.student?.name}</p>
                        <p className="text-xs text-surface-500">Sub ID: #{reg.subscriptionId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          {reg.status === 'REGISTERED' ? (
                            <span className="badge-green">Registered</span>
                          ) : (
                            <span className="badge-gray">Cancelled</span>
                          )}
                          {reg.status === 'CANCELLED' && reg.isSessionRefunded && (
                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 rounded">Refunded</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {reg.status === 'REGISTERED' && isFuture && (
                          <button
                            onClick={() => handleCancel(reg.id)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Cancel Registration"
                          >
                            <NoSymbolIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
