export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'finance' | 'other';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byCategory: { _id: string; count: number }[];
  byPriority: { _id: string; count: number }[];
}

export type FilterStatus = 'all' | 'pending' | 'completed';
export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
