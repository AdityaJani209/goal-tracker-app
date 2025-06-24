const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a goal title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['health', 'career', 'education', 'finance', 'personal', 'relationships', 'other'],
        default: 'personal'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'paused', 'cancelled'],
        default: 'not-started'
    },
    targetDate: {
        type: Date,
        required: [true, 'Please provide a target date']
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    milestones: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        },
        targetDate: {
            type: Date
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedAt: {
        type: Date
    },
    notes: [{
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for better query performance
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, category: 1 });
goalSchema.index({ targetDate: 1 });

// Update progress based on milestones
goalSchema.methods.updateProgress = function () {
    if (this.milestones.length === 0) return;

    const completedMilestones = this.milestones.filter(milestone => milestone.completed).length;
    this.progress = Math.round((completedMilestones / this.milestones.length) * 100);

    // Auto-complete goal if all milestones are done
    if (this.progress === 100 && this.status !== 'completed') {
        this.status = 'completed';
        this.completedAt = new Date();
    }
};

// Pre-save middleware to update progress
goalSchema.pre('save', function (next) {
    if (this.isModified('milestones')) {
        this.updateProgress();
    }
    next();
});

module.exports = mongoose.model('Goal', goalSchema);
