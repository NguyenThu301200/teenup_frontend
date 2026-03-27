import { useState, FormEvent } from 'react';
import { useStudents, useCreateStudent, useDeleteStudent } from '../hooks/useStudents';
import { useParents } from '../hooks/useParents';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Students() {
  const { data: students, isLoading } = useStudents();
  const { data: parents } = useParents();
  const createMutation = useCreateStudent();
  const deleteMutation = useDeleteStudent();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', dateOfBirth: '', parentId: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: { name: string; parentId: number; dateOfBirth?: string } = { 
      name: form.name, 
      parentId: parseInt(form.parentId) 
    };
    if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
    createMutation.mutate(payload as any, {
      onSuccess: () => {
        setShowModal(false);
        setForm({ name: '', dateOfBirth: '', parentId: '' });
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete student "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Students</h1>
          <p className="text-sm text-surface-500 mt-1">{students?.length || 0} total students</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {students?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-surface-400">No students yet. Add a parent first, then add students.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Date of Birth</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Parent</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {students?.map((student) => (
                  <tr key={student.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="text-sm font-medium text-surface-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-600">
                      {student.dateOfBirth ? dayjs(student.dateOfBirth).format('DD/MM/YYYY') : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-600">{student.parent?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Parent *</label>
            <select
              required
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              className="input-field"
            >
              <option value="">Select parent...</option>
              {parents?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
