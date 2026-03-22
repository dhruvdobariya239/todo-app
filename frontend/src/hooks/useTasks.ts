import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { taskApi } from '../api/taskApi';
import { Task, TaskFormData, TaskStats, FilterStatus, Category, Priority } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedStats] = await Promise.all([
        taskApi.getAll(),
        taskApi.getStats(),
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (formData: TaskFormData) => {
    const toastId = toast.loading('Creating task...');
    try {
      const newTask = await taskApi.create(formData);
      setTasks((prev) => [newTask, ...prev]);
      setStats((prev) =>
        prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev
      );
      toast.success('Task created!', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskFormData>) => {
    const toastId = toast.loading('Updating task...');
    try {
      const updated = await taskApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success('Task updated!', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

  const completeTask = async (id: string) => {
    try {
      const updated = await taskApi.complete(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setStats((prev) =>
        prev
          ? { ...prev, completed: prev.completed + 1, pending: prev.pending - 1, completionRate: Math.round(((prev.completed + 1) / prev.total) * 100) }
          : prev
      );
      toast.success('Task completed! 🎉');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const reopenTask = async (id: string) => {
    try {
      const updated = await taskApi.reopen(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setStats((prev) =>
        prev
          ? { ...prev, completed: prev.completed - 1, pending: prev.pending + 1, completionRate: Math.round(((prev.completed - 1) / prev.total) * 100) }
          : prev
      );
      toast.success('Task reopened');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    const toastId = toast.loading('Deleting...');
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              total: prev.total - 1,
              completed: task?.completed ? prev.completed - 1 : prev.completed,
              pending: !task?.completed ? prev.pending - 1 : prev.pending,
            }
          : prev
      );
      toast.success('Task deleted', { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
    }
    return true;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    stats,
    loading,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    createTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
