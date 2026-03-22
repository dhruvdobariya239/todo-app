import { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Task, TaskFormData, Category, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
  editTask?: Task | null;
}

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'personal', label: 'Personal', emoji: '👤' },
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'shopping', label: 'Shopping', emoji: '🛒' },
  { value: 'health', label: 'Health', emoji: '💪' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

const DEFAULT_FORM: TaskFormData = {
  title: '',
  description: '',
  category: 'other',
  priority: 'medium',
  dueDate: '',
};

export default function TaskModal({ isOpen, onClose, onSubmit, editTask }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description || '',
        category: editTask.category,
        priority: editTask.priority,
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.length > 200) newErrors.title = 'Title too long (max 200 chars)';
    if (form.description.length > 1000) newErrors.description = 'Description too long (max 1000 chars)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const success = await onSubmit(form);
    setSubmitting(false);
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editTask ? 'Edit Task' : 'New Task'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="field">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="field-error"><AlertCircle size={12} /> {errors.title}</span>}
          </div>

          {/* Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              placeholder="Add details (optional)..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="field-error"><AlertCircle size={12} /> {errors.description}</span>}
          </div>

          <div className="field-row">
            {/* Category */}
            <div className="field">
              <label><Tag size={13} /> Category</label>
              <div className="chip-group">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`chip ${form.category === c.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, category: c.value })}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="field-row">
            {/* Priority */}
            <div className="field">
              <label>Priority</label>
              <div className="chip-group">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`chip priority-chip ${form.priority === p.value ? 'active' : ''}`}
                    style={{ '--chip-color': p.color } as any}
                    onClick={() => setForm({ ...form, priority: p.value })}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="field">
              <label><Calendar size={13} /> Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
