import { useState, FormEvent } from 'react';
import { useParents, useCreateParent, useDeleteParent } from '../hooks/useParents';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Parents() {
  const { data: parents, isLoading } = useParents();
  const createMutation = useCreateParent();
  const deleteMutation = useDeleteParent();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: { name: string; email: string; phone?: string } = { name: form.name, email: form.email };
    if (form.phone) payload.phone = form.phone;
    createMutation.mutate(payload as any, {
      onSuccess: () => {
        setShowModal(false);
        setForm({ name: '', email: '', phone: '' });
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete parent "${name}"? This will also delete all linked students.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Parents</h1>
          <p className="text-sm text-surface-500 mt-1">{parents?.length || 0} total parents</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Parent
        </button>
      </div>

      {parents?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-surface-400">No parents yet. Add your first parent to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents?.map((parent) => (
            <div key={parent.id} className="card p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-surface-900 truncate">{parent.name}</h3>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-surface-500">
                      <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{parent.email}</span>
                    </div>
                    {parent.phone && (
                      <div className="flex items-center gap-2 text-sm text-surface-500">
                        <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{parent.phone}</span>
                      </div>
                    )}
                  </div>
                  {parent.students && parent.students.length > 0 && (
                    <div className="mt-3">
                      <span className="badge-blue">{parent.students.length} student{parent.students.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(parent.id, parent.name)}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Parent">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Enter parent name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="parent@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              placeholder="Optional"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Parent'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
