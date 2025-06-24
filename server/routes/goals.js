const express = require('express');
const { body, query } = require('express-validator');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const inMemoryDB = require('../inMemoryDB');

const router = express.Router();

// Check if MongoDB is available
const mongoose = require('mongoose');
const isMongoDBConnected = () => {
    return mongoose.connection.readyState === 1;
};

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', [
    query('status')
        .optional()
        .isIn(['not-started', 'in-progress', 'completed', 'paused', 'cancelled'])
        .withMessage('Invalid status'),
    query('category')
        .optional()
        .isIn(['health', 'career', 'education', 'finance', 'personal', 'relationships', 'other'])
        .withMessage('Invalid category'),
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
], validate, async (req, res) => {
    try {
        const { status, category, priority, page = 1, limit = 10, search } = req.query;

        let goals, total;

        if (isMongoDBConnected()) {
            // Use MongoDB
            const filter = { user: req.user.id };
            if (status) filter.status = status;
            if (category) filter.category = category;
            if (priority) filter.priority = priority;

            // Add search functionality
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }

            // Calculate pagination
            const skip = (page - 1) * limit;

            // Get goals with pagination
            goals = await Goal.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Get total count for pagination
            total = await Goal.countDocuments(filter);
        } else {
            // Use in-memory database
            let allGoals = await inMemoryDB.findGoalsByUserId(req.user._id);

            // Apply filters
            if (status) {
                allGoals = allGoals.filter(goal => goal.status === status);
            }
            if (category) {
                allGoals = allGoals.filter(goal => goal.category === category);
            }
            if (priority) {
                allGoals = allGoals.filter(goal => goal.priority === priority);
            }
            if (search) {
                const searchLower = search.toLowerCase();
                allGoals = allGoals.filter(goal => 
                    goal.title.toLowerCase().includes(searchLower) ||
                    goal.description.toLowerCase().includes(searchLower)
                );
            }

            // Sort by creation date (newest first)
            allGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Apply pagination
            total = allGoals.length;
            const skip = (page - 1) * limit;
            goals = allGoals.slice(skip, skip + parseInt(limit));
        }

        res.json({
            success: true,
            count: goals.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            goals
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/goals/:id
// @desc    Get single goal
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        let goal;

        if (isMongoDBConnected()) {
            goal = await Goal.findOne({
                _id: req.params.id,
                user: req.user.id
            });
        } else {
            goal = await inMemoryDB.findGoalById(parseInt(req.params.id));
            if (goal && goal.user !== req.user._id) {
                goal = null; // Don't return goals that don't belong to the user
            }
        }

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        res.json({
            success: true,
            goal
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/goals
// @desc    Create new goal
// @access  Private
router.post('/', [
    body('title')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Title is required and must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('category')
        .isIn(['health', 'career', 'education', 'finance', 'personal', 'relationships', 'other'])
        .withMessage('Invalid category'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    body('targetDate')
        .isISO8601()
        .withMessage('Target date must be a valid date'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    body('milestones')
        .optional()
        .isArray()
        .withMessage('Milestones must be an array')
], validate, async (req, res) => {
    try {
        let goal;

        if (isMongoDBConnected()) {
            const goalData = {
                ...req.body,
                user: req.user.id
            };
            goal = await Goal.create(goalData);
        } else {
            const goalData = {
                ...req.body,
                user: req.user._id,
                status: req.body.status || 'active'
            };
            goal = await inMemoryDB.createGoal(goalData);
        }

        res.status(201).json({
            success: true,
            message: 'Goal created successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('category')
        .optional()
        .isIn(['health', 'career', 'education', 'finance', 'personal', 'relationships', 'other'])
        .withMessage('Invalid category'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    body('status')
        .optional()
        .isIn(['not-started', 'in-progress', 'completed', 'paused', 'cancelled'])
        .withMessage('Invalid status'),
    body('targetDate')
        .optional()
        .isISO8601()
        .withMessage('Target date must be a valid date'),
    body('progress')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Progress must be between 0 and 100')
], validate, async (req, res) => {
    try {
        let goal;

        if (isMongoDBConnected()) {
            goal = await Goal.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!goal) {
                return res.status(404).json({
                    success: false,
                    message: 'Goal not found'
                });
            }

            // Handle status change to completed
            if (req.body.status === 'completed' && goal.status !== 'completed') {
                req.body.completedAt = new Date();
                req.body.progress = 100;
            }

            goal = await Goal.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
        } else {
            goal = await inMemoryDB.findGoalById(parseInt(req.params.id));

            if (!goal || goal.user !== req.user._id) {
                return res.status(404).json({
                    success: false,
                    message: 'Goal not found'
                });
            }

            // Handle status change to completed
            if (req.body.status === 'completed' && goal.status !== 'completed') {
                req.body.completedAt = new Date();
                req.body.progress = 100;
            }

            goal = await inMemoryDB.updateGoal(parseInt(req.params.id), req.body);
        }

        res.json({
            success: true,
            message: 'Goal updated successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        let goal;

        if (isMongoDBConnected()) {
            goal = await Goal.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!goal) {
                return res.status(404).json({
                    success: false,
                    message: 'Goal not found'
                });
            }

            await Goal.findByIdAndDelete(req.params.id);
        } else {
            goal = await inMemoryDB.findGoalById(parseInt(req.params.id));

            if (!goal || goal.user !== req.user._id) {
                return res.status(404).json({
                    success: false,
                    message: 'Goal not found'
                });
            }

            await inMemoryDB.deleteGoal(parseInt(req.params.id));
        }

        res.json({
            success: true,
            message: 'Goal deleted successfully'
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/goals/:id/milestones
// @desc    Add milestone to goal
// @access  Private
router.post('/:id/milestones', [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Milestone title is required'),
    body('description')
        .optional()
        .trim(),
    body('targetDate')
        .optional()
        .isISO8601()
        .withMessage('Target date must be a valid date')
], validate, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        goal.milestones.push(req.body);
        await goal.save();

        res.status(201).json({
            success: true,
            message: 'Milestone added successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/goals/:id/milestones/:milestoneId
// @desc    Update milestone
// @access  Private
router.put('/:id/milestones/:milestoneId', async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        const milestone = goal.milestones.id(req.params.milestoneId);
        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: 'Milestone not found'
            });
        }

        // Update milestone fields
        Object.keys(req.body).forEach(key => {
            milestone[key] = req.body[key];
        });

        // If marking as completed, set completedAt
        if (req.body.completed && !milestone.completedAt) {
            milestone.completedAt = new Date();
        }

        await goal.save();

        res.json({
            success: true,
            message: 'Milestone updated successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/goals/:id/milestones/:milestoneId
// @desc    Delete milestone
// @access  Private
router.delete('/:id/milestones/:milestoneId', async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        goal.milestones.pull(req.params.milestoneId);
        await goal.save();

        res.json({
            success: true,
            message: 'Milestone deleted successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/goals/:id/notes
// @desc    Add note to goal
// @access  Private
router.post('/:id/notes', [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Note content is required')
], validate, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        goal.notes.push({ content: req.body.content });
        await goal.save();

        res.status(201).json({
            success: true,
            message: 'Note added successfully',
            goal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/goals/stats/overview
// @desc    Get user's goal statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
    try {
        let stats;

        if (isMongoDBConnected()) {
            const userId = req.user.id;

            // Get basic stats
            const totalGoals = await Goal.countDocuments({ user: userId });
            const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });
            const inProgressGoals = await Goal.countDocuments({ user: userId, status: 'in-progress' });
            const overdueGoals = await Goal.countDocuments({
                user: userId,
                targetDate: { $lt: new Date() },
                status: { $nin: ['completed', 'cancelled'] }
            });

            // Get category breakdown
            const categoryStats = await Goal.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]);

            // Get monthly progress
            const monthlyStats = await Goal.aggregate([
                { $match: { user: req.user._id, completedAt: { $exists: true } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$completedAt' },
                            month: { $month: '$completedAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]);

            stats = {
                total: totalGoals,
                completed: completedGoals,
                inProgress: inProgressGoals,
                overdue: overdueGoals,
                completionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
                categories: categoryStats,
                monthlyProgress: monthlyStats
            };
        } else {
            // Use in-memory database
            stats = await inMemoryDB.getGoalStats(req.user._id);
        }

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
