import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Task from '../models/Task.js';

const router = express.Router();

// Helper: send validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// GET /api/tasks - Get all tasks with optional filters
router.get(
  '/',
  [
    query('category').optional().isIn(['personal', 'work', 'shopping', 'health', 'finance', 'other']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('completed').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.category) filter.category = req.query.category;
      if (req.query.priority) filter.priority = req.query.priority;
      if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';

      const tasks = await Task.find(filter).sort({ createdAt: -1 });

      res.json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/tasks/:id - Get single task
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/tasks - Create task
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('category').optional().isIn(['personal', 'work', 'shopping', 'health', 'finance', 'other']).withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, category, priority, dueDate } = req.body;
      const task = await Task.create({ title, description, category, priority, dueDate: dueDate || null });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/tasks/:id - Update task
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('category').optional().isIn(['personal', 'work', 'shopping', 'health', 'finance', 'other']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const allowedFields = ['title', 'description', 'category', 'priority', 'dueDate'];
      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      const updated = await Task.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({ success: true, message: 'Task updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/tasks/:id/complete - Toggle complete
router.patch(
  '/:id/complete',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      if (task.completed) {
        return res.status(400).json({
          success: false,
          message: 'Task is already marked as completed',
        });
      }

      task.completed = true;
      await task.save();

      res.json({ success: true, message: 'Task marked as completed', data: task });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/tasks/:id/reopen - Reopen a completed task
router.patch(
  '/:id/reopen',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      if (!task.completed) {
        return res.status(400).json({ success: false, message: 'Task is not completed' });
      }

      task.completed = false;
      await task.save();

      res.json({ success: true, message: 'Task reopened', data: task });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/tasks/:id - Delete task
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/tasks/stats/summary - Get task statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const [total, completed, byCategory, byPriority] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        byCategory,
        byPriority,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
