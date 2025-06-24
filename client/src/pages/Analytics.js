import React, { useEffect } from 'react';
import { useGoals } from '../contexts/GoalContext';
import {
    BarChart3,
    TrendingUp,
    Target,
    CheckCircle,
    Clock,
    AlertTriangle,
    Calendar,
    Award
} from 'lucide-react';

const Analytics = () => {
    const { stats, fetchStats, loading } = useGoals();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const getCategoryData = () => {
        return stats.categories?.map(cat => ({
            name: cat._id,
            value: cat.count,
            color: getCategoryColor(cat._id)
        })) || [];
    };

    const getCategoryColor = (category) => {
        const colors = {
            health: '#ef4444',
            career: '#3b82f6',
            education: '#8b5cf6',
            finance: '#22c55e',
            personal: '#f59e0b',
            relationships: '#ec4899',
            other: '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    const getMonthlyData = () => {
        return stats.monthlyProgress?.map(month => ({
            month: `${month._id.year}-${month._id.month.toString().padStart(2, '0')}`,
            completed: month.count
        })) || [];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Track your progress and insights</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                            <Target className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Goals</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
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
                            <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
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
                            <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
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
                            <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion Rate */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Completion Rate</h3>
                        <div className="flex items-center text-success-600">
                            <TrendingUp className="h-5 w-5 mr-1" />
                            <span className="font-semibold">{stats.completionRate}%</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-center w-48 h-48 mx-auto">
                            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.completionRate / 100)}`}
                                    className="text-success-600 transition-all duration-1000"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">{stats.completionRate}%</div>
                                    <div className="text-sm text-gray-600">Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Completed</span>
                            <span className="font-medium">{stats.completed} goals</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-medium">{stats.total - stats.completed} goals</span>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="card p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Goals by Category</h3>

                    {getCategoryData().length > 0 ? (
                        <div className="space-y-4">
                            {getCategoryData().map((category) => (
                                <div key={category.name} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className="w-4 h-4 rounded-full mr-3"
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">{category.value} goals</span>
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    backgroundColor: category.color,
                                                    width: `${(category.value / stats.total) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No data available</p>
                    )}
                </div>
            </div>

            {/* Monthly Progress */}
            <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Completion Trend</h3>

                {getMonthlyData().length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Month</span>
                            <span>Goals Completed</span>
                        </div>
                        {getMonthlyData().slice(-6).map((month) => (
                            <div key={month.month} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(month.month + '-01').toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">{month.completed} goals</span>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full"
                                            style={{ width: `${Math.min((month.completed / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No completion data yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Complete some goals to see your progress trend.
                        </p>
                    </div>
                )}
            </div>

            {/* Achievements */}
            <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Achievements</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Goal Achievement */}
                    <div className={`p-4 rounded-lg border-2 ${stats.completed > 0 ? 'border-success-200 bg-success-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                            <Award className={`h-8 w-8 ${stats.completed > 0 ? 'text-success-600' : 'text-gray-400'}`} />
                            <div className="ml-3">
                                <h4 className={`font-medium ${stats.completed > 0 ? 'text-success-900' : 'text-gray-500'}`}>
                                    First Goal
                                </h4>
                                <p className={`text-sm ${stats.completed > 0 ? 'text-success-700' : 'text-gray-400'}`}>
                                    Complete your first goal
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Goal Streak Achievement */}
                    <div className={`p-4 rounded-lg border-2 ${stats.completed >= 5 ? 'border-success-200 bg-success-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                            <Award className={`h-8 w-8 ${stats.completed >= 5 ? 'text-success-600' : 'text-gray-400'}`} />
                            <div className="ml-3">
                                <h4 className={`font-medium ${stats.completed >= 5 ? 'text-success-900' : 'text-gray-500'}`}>
                                    Goal Achiever
                                </h4>
                                <p className={`text-sm ${stats.completed >= 5 ? 'text-success-700' : 'text-gray-400'}`}>
                                    Complete 5 goals
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* High Achiever */}
                    <div className={`p-4 rounded-lg border-2 ${stats.completionRate >= 80 ? 'border-success-200 bg-success-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                            <Award className={`h-8 w-8 ${stats.completionRate >= 80 ? 'text-success-600' : 'text-gray-400'}`} />
                            <div className="ml-3">
                                <h4 className={`font-medium ${stats.completionRate >= 80 ? 'text-success-900' : 'text-gray-500'}`}>
                                    High Achiever
                                </h4>
                                <p className={`text-sm ${stats.completionRate >= 80 ? 'text-success-700' : 'text-gray-400'}`}>
                                    80% completion rate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
