import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['personal', 'work', 'shopping', 'health', 'finance', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-set completedAt when task is marked complete
taskSchema.pre('save', function (next) {
  if (this.isModified('completed')) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.completed === true) {
    update.completedAt = new Date();
  } else if (update.completed === false) {
    update.completedAt = null;
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
