import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGoals } from '../contexts/GoalContext';
import GoalCard from '../components/goals/GoalCard';
import GoalFilters from '../components/goals/GoalFilters';
import CreateGoalModal from '../components/goals/CreateGoalModal';
import { Plus, Search } from 'lucide-react';

const Goals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    goals,
    totalGoals,
    currentPage,
    totalPages,
    loading,
    filters,
    fetchGoals,
    setFilters
  } = useGoals();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Check if we should show create modal from URL params
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowCreateModal(true);
      // Remove the 'new' param from URL
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Fetch goals when filters change
  useEffect(() => {
    fetchGoals(currentPage);
  }, [fetchGoals, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handlePageChange = (page) => {
    fetchGoals(page);
  };

  const handleGoalCreated = () => {
    setShowCreateModal(false);
    fetchGoals(1); // Refresh goals list
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600">
            {totalGoals > 0 ? `${totalGoals} total goals` : 'No goals yet'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Search className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </form>

          {/* Filters */}
          <GoalFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Goals List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : goals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalGoals)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalGoals}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                              ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No goals found</h3>
          <p className="mt-2 text-gray-500">
            {Object.values(filters).some(filter => filter !== '')
              ? "Try adjusting your filters to see more goals."
              : "Get started by creating your first goal."
            }
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
};

export default Goals;
