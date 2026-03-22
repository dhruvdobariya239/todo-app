import { CheckCheck, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { TaskStats } from '../types';

interface StatsBarProps {
  stats: TaskStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon total"><ListTodo size={20} /></div>
        <div className="stat-info">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon pending"><Clock size={20} /></div>
        <div className="stat-info">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon done"><CheckCheck size={20} /></div>
        <div className="stat-info">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon rate"><TrendingUp size={20} /></div>
        <div className="stat-info">
          <span className="stat-value">{stats.completionRate}%</span>
          <span className="stat-label">Done Rate</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${stats.completionRate}%` }} />
        </div>
      </div>
    </div>
  );
}
