import React from 'react';
import { Filter, X } from 'lucide-react';

const GoalFilters = ({ filters, onFilterChange }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'health', label: 'Health' },
    { value: 'career', label: 'Career' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'personal', label: 'Personal' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      category: '',
      priority: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center text-sm text-gray-700">
        <Filter className="h-4 w-4 mr-2" />
        Filters:
      </div>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="block w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="block w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="block w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      >
        {priorities.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </button>
      )}
    </div>
  );
};

export default GoalFilters;
