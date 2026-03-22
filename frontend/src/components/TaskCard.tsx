import { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, Calendar, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  personal: '👤', work: '💼', shopping: '🛒',
  health: '💪', finance: '💰', other: '📌',
};

const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'priority-low' },
  medium: { label: 'Medium', cls: 'priority-medium' },
  high: { label: 'High', cls: 'priority-high' },
};

export default function TaskCard({ task, onComplete, onReopen, onEdit, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && !task.completed && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-main">
        {/* Checkbox */}
        <button
          className="check-btn"
          onClick={() => task.completed ? onReopen(task._id) : onComplete(task._id)}
          title={task.completed ? 'Reopen task' : 'Mark complete'}
        >
          {task.completed
            ? <CheckCircle2 size={22} className="check-done" />
            : <Circle size={22} className="check-idle" />
          }
        </button>

        {/* Content */}
        <div className="task-content" onClick={() => setExpanded(!expanded)}>
          <div className="task-title-row">
            <span className="task-title">{task.title}</span>
            <div className="task-badges">
              <span className="badge category-badge">
                {CATEGORY_EMOJI[task.category]} {task.category}
              </span>
              <span className={`badge ${PRIORITY_CONFIG[task.priority].cls}`}>
                {PRIORITY_CONFIG[task.priority].label}
              </span>
            </div>
          </div>

          <div className="task-meta">
            {dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue-text' : ''} ${isDueToday ? 'due-today' : ''}`}>
                <Calendar size={12} />
                {isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}
                {format(dueDate, 'MMM d, yyyy')}
              </span>
            )}
            {task.completed && task.completedAt && (
              <span className="completed-text">
                ✓ Done {format(new Date(task.completedAt), 'MMM d')}
              </span>
            )}
            {task.description && (
              <button className="expand-btn" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {expanded ? 'less' : 'more'}
              </button>
            )}
          </div>

          {expanded && task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="task-actions">
          {task.completed && (
            <button className="icon-btn reopen-btn" onClick={() => onReopen(task._id)} title="Reopen">
              <RefreshCw size={15} />
            </button>
          )}
          {!task.completed && (
            <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">
              <Pencil size={15} />
            </button>
          )}
          <button
            className={`icon-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
