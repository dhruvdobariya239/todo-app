import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Plus, CheckSquare, RefreshCw } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import { Task } from './types';
import './App.css';

export default function App() {
  const {
    tasks, stats, loading,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filterPriority, setFilterPriority,
    searchQuery, setSearchQuery,
    createTask, updateTask,
    completeTask, reopenTask, deleteTask,
    refetch,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  const handleModalSubmit = async (data: any) => {
    if (editTask) return updateTask(editTask._id, data);
    return createTask(data);
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e1e2e', color: '#cdd6f4', border: '1px solid #313244' },
          success: { iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' } },
          error: { iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' } },
        }}
      />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon"><CheckSquare size={24} /></div>
            <div>
              <h1 className="brand-title">TaskFlow</h1>
              <p className="brand-sub">Stay organized, stay ahead</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn refresh-btn" onClick={refetch} title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button className="btn btn-primary new-task-btn" onClick={() => setModalOpen(true)}>
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Filters */}
        <FilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultCount={tasks.length}
        />

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                  ? '🔍' : '✨'}
              </div>
              <p className="empty-title">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                  ? 'No tasks match your filters'
                  : 'No tasks yet'}
              </p>
              <p className="empty-sub">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first task to get started!'}
              </p>
              {!(searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all') && (
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                  <Plus size={16} /> Create Task
                </button>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={completeTask}
                onReopen={reopenTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editTask={editTask}
      />
    </div>
  );
}
