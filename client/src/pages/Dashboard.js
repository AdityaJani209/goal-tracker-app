import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoals } from '../contexts/GoalContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Plus,
  Calendar,
  BarChart3
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { goals, stats, fetchGoals, fetchStats, loading } = useGoals();
  const [recentGoals, setRecentGoals] = useState([]);

  useEffect(() => {
    fetchGoals(1, 6); // Fetch first 6 goals for recent goals
    fetchStats();
  }, [fetchGoals, fetchStats]);

  useEffect(() => {
    setRecentGoals(goals.slice(0, 6));
  }, [goals]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100';
      case 'in-progress':
        return 'text-primary-600 bg-primary-100';
      case 'not-started':
        return 'text-gray-600 bg-gray-100';
      case 'paused':
        return 'text-warning-600 bg-warning-100';
      case 'cancelled':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'low':
        return 'text-success-600 bg-success-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to crush your goals today? Let's see what you've got planned.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Target className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 text-success-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100 text-warning-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.inProgress || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-danger-100 text-danger-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.overdue || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      {stats && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Goal Completion Rate</h3>
            <div className="flex items-center text-success-600">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="font-semibold">{stats.completionRate}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-success-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            You've completed {stats.completed} out of {stats.total} goals
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Goals */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Goals</h3>
            <Link to="/goals" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {recentGoals.length > 0 ? (
            <div className="space-y-4">
              {recentGoals.map((goal) => (
                <div key={goal._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/goals/${goal._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {goal.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                        {isOverdue(goal.targetDate, goal.status) && (
                          <span className="ml-2 text-danger-600 font-medium">Overdue</span>
                        )}
                        {isDueSoon(goal.targetDate, goal.status) && (
                          <span className="ml-2 text-warning-600 font-medium">Due soon</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900">{goal.progress}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first goal.</p>
              <div className="mt-4">
                <Link to="/goals?new=true" className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Goal
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/goals?new=true"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Create New Goal</span>
            </Link>
            
            <Link
              to="/goals?status=in-progress"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-5 w-5 text-warning-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Active Goals</span>
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
