import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSearchParams } from 'react-router-dom';
import { useGoals } from '../contexts/GoalContext';
import GoalFilters from '../components/goals/GoalFilters';
import CreateGoalModal from '../components/goals/CreateGoalModal';
import EditGoalModal from '../components/goals/EditGoalModal';
import { Plus, Search, Calendar, Edit, ArrowDown, Minus, ArrowUp } from 'lucide-react';

const Goals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    goals,
    loading,
    filters,
    fetchGoals,
    setFilters,
    updateGoal
  } = useGoals();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [kanbanGoals, setKanbanGoals] = useState({
    'not-started': [],
    'in-progress': [],
    'completed': [],
    'paused': [],
    'cancelled': []
  });

  // Get category color function (same as Analytics page)
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
  // Define column configuration
  const columns = [
    {
      id: 'not-started',
      title: 'Not Started',
      color: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
      headerColor: 'bg-gray-50 dark:bg-gray-800',
      count: kanbanGoals['not-started']?.length || 0
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
      headerColor: 'bg-blue-100 dark:bg-blue-800/30',
      count: kanbanGoals['in-progress']?.length || 0
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
      headerColor: 'bg-green-100 dark:bg-green-800/30',
      count: kanbanGoals['completed']?.length || 0
    },
    {
      id: 'paused',
      title: 'Paused',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
      headerColor: 'bg-yellow-100 dark:bg-yellow-800/30',
      count: kanbanGoals['paused']?.length || 0
    },
    {
      id: 'cancelled',
      title: 'Cancelled',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
      headerColor: 'bg-red-100 dark:bg-red-800/30',
      count: kanbanGoals['cancelled']?.length || 0
    }
  ];

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
    fetchGoals(1);
  }, [fetchGoals, filters]);
  // Organize goals into kanban columns
  useEffect(() => {
    const organized = {
      'not-started': [],
      'in-progress': [],
      'completed': [],
      'paused': [],
      'cancelled': []
    };

    if (goals && goals.length > 0) {
      goals.forEach(goal => {
        const status = goal.status || 'not-started';
        if (organized[status]) {
          organized[status].push(goal);
        }
      });
    }

    setKanbanGoals(organized);
  }, [goals]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };
  const handleGoalCreated = () => {
    setShowCreateModal(false);
    fetchGoals(1); // Refresh goals list
  };

  const handleGoalUpdated = () => {
    setShowEditModal(false);
    setSelectedGoal(null);
    fetchGoals(1); // Refresh goals list
  };

  const handleEditGoal = (goal, e) => {
    e.stopPropagation(); // Prevent drag from starting
    setSelectedGoal(goal);
    setShowEditModal(true);
  };  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the goal being moved
    const goalId = draggableId;
    const goal = goals.find(g => g._id.toString() === goalId);

    if (!goal) {
      return;
    }

    // Update goal status
    const newStatus = destination.droppableId;
    const updatedGoal = { ...goal, status: newStatus };

    // Optimistically update local state
    const newKanbanGoals = { ...kanbanGoals };
    
    // Remove from source column
    newKanbanGoals[source.droppableId] = newKanbanGoals[source.droppableId].filter(
      g => g._id.toString() !== goalId
    );
    
    // Add to destination column
    newKanbanGoals[destination.droppableId].splice(destination.index, 0, updatedGoal);
    
    setKanbanGoals(newKanbanGoals);

    // Update goal on server
    try {
      await updateGoal(goalId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update goal status:', error);
      // Revert optimistic update on error
      setKanbanGoals(kanbanGoals);
    }
  };  // Goal Card Component for Kanban
  const KanbanGoalCard = ({ goal, index }) => (
    <Draggable draggableId={goal._id.toString()} index={index}>
      {(provided, snapshot) => (        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-transform select-none relative ${
            snapshot.isDragging 
              ? 'rotate-2 shadow-lg scale-105 z-50 cursor-grabbing' 
              : 'hover:shadow-md cursor-grab'
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Edit Button */}
          <button
            onClick={(e) => handleEditGoal(goal, e)}
            className="absolute top-2 right-2 p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
            style={{ 
              // Override drag handle on this button
              ...(provided.dragHandleProps ? {} : {}),
              cursor: 'pointer'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Edit className="w-4 h-4" />
          </button>

          <div className="mb-2 pr-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-3">
              {goal.title}
            </h3>
          </div>
          
          {goal.description && (
            <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
              {goal.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-1"
                  style={{ backgroundColor: getCategoryColor(goal.category) }}
                ></div>
                <span className="capitalize">{goal.category}</span>
              </div>
              
              {goal.targetDate && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {/* Priority Icon */}
            <div className="flex items-center">
              {goal.priority === 'high' && (
                <ArrowUp className="w-4 h-4 text-red-500" title="High Priority" />
              )}
              {goal.priority === 'medium' && (
                <Minus className="w-4 h-4 text-yellow-500" title="Medium Priority" />
              )}
              {goal.priority === 'low' && (
                <ArrowDown className="w-4 h-4 text-green-500" title="Low Priority" />
              )}
            </div>
          </div>

          {goal.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your goals with drag-and-drop kanban board
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 sm:mt-0 btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </button>
      </div>      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-96 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md">
          <GoalFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {columns.map((column) => (            <div key={column.id} className={`rounded-lg border-2 ${column.color} dark:bg-gray-800 dark:border-gray-600 min-h-96`}>
              {/* Column Header */}
              <div className={`p-4 ${column.headerColor} dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {column.title}
                  </h3>
                  <span className="bg-white dark:bg-gray-600 px-2 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-200">
                    {column.count}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id} type="GOAL">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}                    className={`p-4 min-h-80 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 bg-opacity-50' : ''
                    }`}
                  >
                    {kanbanGoals[column.id]?.map((goal, index) => (
                      <KanbanGoalCard
                        key={goal._id}
                        goal={goal}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                      {kanbanGoals[column.id]?.length === 0 && (
                      <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">No goals yet</p>
                      </div>
                    )}
                  </div>                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>      {/* Create Goal Modal */}
      {showCreateModal && (
        <CreateGoalModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}

      {/* Edit Goal Modal */}
      {showEditModal && selectedGoal && (
        <EditGoalModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          onGoalUpdated={handleGoalUpdated}
        />
      )}
    </div>
  );
};

export default Goals;
