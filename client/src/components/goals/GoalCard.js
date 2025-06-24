import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Target, AlertTriangle } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const GoalCard = ({ goal }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100 border-success-200';
      case 'in-progress':
        return 'text-primary-600 bg-primary-100 border-primary-200';
      case 'not-started':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'paused':
        return 'text-warning-600 bg-warning-100 border-warning-200';
      case 'cancelled':
        return 'text-danger-600 bg-danger-100 border-danger-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-100 border-danger-200';
      case 'medium':
        return 'text-warning-600 bg-warning-100 border-warning-200';
      case 'low':
        return 'text-success-600 bg-success-100 border-success-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health':
        return '💪';
      case 'career':
        return '💼';
      case 'education':
        return '📚';
      case 'finance':
        return '💰';
      case 'personal':
        return '🌱';
      case 'relationships':
        return '❤️';
      default:
        return '🎯';
    }
  };

  const isOverdue = (targetDate, status) => {
    return status !== 'completed' && isAfter(new Date(), new Date(targetDate));
  };

  const isDueSoon = (targetDate, status) => {
    const threeDaysFromNow = addDays(new Date(), 3);
    return status !== 'completed' && 
           isBefore(new Date(), new Date(targetDate)) && 
           isAfter(threeDaysFromNow, new Date(targetDate));
  };

  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = goal.milestones?.length || 0;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getCategoryIcon(goal.category)}</span>
            <div>
              <Link 
                to={`/goals/${goal._id}`}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
              >
                {goal.title}
              </Link>
              <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
            {goal.priority}
          </span>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {goal.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                goal.progress === 100 ? 'bg-success-600' : 'bg-primary-600'
              }`}
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Milestones */}
        {totalMilestones > 0 && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Target className="h-4 w-4 mr-1" />
            <span>{completedMilestones}/{totalMilestones} milestones completed</span>
          </div>
        )}

        {/* Status and Due Date */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
            {goal.status.replace('-', ' ')}
          </span>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {format(new Date(goal.targetDate), 'MMM d, yyyy')}
              {isOverdue(goal.targetDate, goal.status) && (
                <span className="ml-2 text-danger-600 font-medium flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </span>
              )}
              {isDueSoon(goal.targetDate, goal.status) && (
                <span className="ml-2 text-warning-600 font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Due soon
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {goal.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
            {goal.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                +{goal.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created {format(new Date(goal.createdAt), 'MMM d, yyyy')}
          </span>
          <Link
            to={`/goals/${goal._id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
