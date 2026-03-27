import { useState, FormEvent } from 'react';
import { useSubscriptions, useCreateSubscription, useCancelSubscription } from '../hooks/useSubscriptions';
import { useStudents } from '../hooks/useStudents';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, NoSymbolIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Subscriptions() {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { data: students } = useStudents();
  const createMutation = useCreateSubscription();
  const cancelMutation = useCancelSubscription();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    studentId: '',
    totalSessions: '10',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(3, 'months').format('YYYY-MM-DD'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        studentId: parseInt(form.studentId),
        totalSessions: parseInt(form.totalSessions),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setForm({
            studentId: '',
            totalSessions: '10',
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().add(3, 'months').format('YYYY-MM-DD'),
          });
        },
      }
    );
  };

  const handleCancel = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Subscriptions</h1>
          <p className="text-sm text-surface-500 mt-1">{subscriptions?.length || 0} total subscriptions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Subscription
        </button>
      </div>

      {subscriptions?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-surface-400">No subscriptions found. Create one.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Sessions</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Validity Period</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {subscriptions?.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <CreditCardIcon className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="text-sm font-medium text-surface-800">{sub.student?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-surface-900">
                        <span className="font-semibold">{sub.remainingSessions}</span> / {sub.totalSessions} left
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-600">
                      {dayjs(sub.startDate).format('DD/MM/YYYY')} - {dayjs(sub.endDate).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-5 py-3.5">
                      {sub.status === 'ACTIVE' && <span className="badge-green">Active</span>}
                      {sub.status === 'EXPIRED' && <span className="badge-yellow">Expired</span>}
                      {sub.status === 'CANCELLED' && <span className="badge-red">Cancelled</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Cancel Subscription"
                        >
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Subscription">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Student *</label>
            <select
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="input-field"
            >
              <option value="">Select student...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (Parent: {s.parent?.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Total Sessions *</label>
            <input
              type="number"
              required
              min={1}
              value={form.totalSessions}
              onChange={(e) => setForm({ ...form, totalSessions: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
