import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterStatus, Category, Priority } from '../types';

interface FilterBarProps {
  filterStatus: FilterStatus;
  setFilterStatus: (v: FilterStatus) => void;
  filterCategory: Category | 'all';
  setFilterCategory: (v: Category | 'all') => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (v: Priority | 'all') => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  resultCount: number;
}

export default function FilterBar({
  filterStatus, setFilterStatus,
  filterCategory, setFilterCategory,
  filterPriority, setFilterPriority,
  searchQuery, setSearchQuery,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      <div className="filter-controls">
        <SlidersHorizontal size={15} className="filter-icon" />

        <div className="filter-group">
          {(['all', 'pending', 'completed'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="personal">👤 Personal</option>
          <option value="work">💼 Work</option>
          <option value="shopping">🛒 Shopping</option>
          <option value="health">💪 Health</option>
          <option value="finance">💰 Finance</option>
          <option value="other">📌 Other</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <span className="result-count">{resultCount} task{resultCount !== 1 ? 's' : ''}</span>
    </div>
  );
}
