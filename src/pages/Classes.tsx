import { useState, FormEvent } from 'react';
import { useClasses, useCreateClass, useDeleteClass } from '../hooks/useClasses';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function Classes() {
  const { data: classes, isLoading } = useClasses();
  const createMutation = useCreateClass();
  const deleteMutation = useDeleteClass();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', maxStudents: '10',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: form.name,
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      maxStudents: parseInt(form.maxStudents),
    };
    if (form.description) payload.description = form.description;
    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowModal(false);
        setForm({ name: '', description: '', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', maxStudents: '10' });
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete class "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Classes</h1>
          <p className="text-sm text-surface-500 mt-1">{classes?.length || 0} total classes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Class
        </button>
      </div>

      {classes?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-surface-400">No classes yet. Create your first class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((cls) => {
            const registered = cls.classRegistrations?.length || 0;
            return (
              <div key={cls.id} className="card p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-surface-900">{cls.name}</h3>
                    {cls.description && (
                      <p className="text-sm text-surface-500 mt-1 line-clamp-2">{cls.description}</p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="badge-blue">{cls.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <ClockIcon className="h-4 w-4 text-surface-400" />
                        <span>{cls.startTime} – {cls.endTime}</span>
                      </div>
                      <p className="text-sm text-surface-500">
                        Capacity: <span className="font-medium">{registered}/{cls.maxStudents}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cls.id, cls.name)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Class">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="e.g. English A1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
              rows={2}
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Day of Week *</label>
            <select
              value={form.dayOfWeek}
              onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
              className="input-field"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Max Students *</label>
            <input
              type="number"
              required
              min={1}
              value={form.maxStudents}
              onChange={(e) => setForm({ ...form, maxStudents: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
