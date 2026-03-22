import axios from 'axios';
import { Task, TaskFormData, TaskStats } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  getAll: async (filters?: { category?: string; priority?: string; completed?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.completed !== undefined) params.append('completed', String(filters.completed));
    const { data } = await api.get<{ success: boolean; data: Task[] }>(`/tasks?${params}`);
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
    return data.data;
  },

  create: async (task: TaskFormData) => {
    const { data } = await api.post<{ success: boolean; data: Task }>('/tasks', task);
    return data.data;
  },

  update: async (id: string, updates: Partial<TaskFormData>) => {
    const { data } = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, updates);
    return data.data;
  },

  complete: async (id: string) => {
    const { data } = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/complete`);
    return data.data;
  },

  reopen: async (id: string) => {
    const { data } = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/reopen`);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },

  getStats: async () => {
    const { data } = await api.get<{ success: boolean; data: TaskStats }>('/tasks/stats/summary');
    return data.data;
  },
};
