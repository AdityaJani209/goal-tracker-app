import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

const GoalContext = createContext();

const goalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_GOALS':
      return { 
        ...state, 
        goals: action.payload.goals,
        totalGoals: action.payload.total,
        currentPage: action.payload.page,
        totalPages: action.payload.pages,
        loading: false 
      };
    case 'ADD_GOAL':
      return { 
        ...state, 
        goals: [action.payload, ...state.goals],
        totalGoals: state.totalGoals + 1
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal._id === action.payload._id ? action.payload : goal
        ),
        selectedGoal: state.selectedGoal?._id === action.payload._id 
          ? action.payload 
          : state.selectedGoal
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        totalGoals: state.totalGoals - 1
      };
    case 'SET_SELECTED_GOAL':
      return { ...state, selectedGoal: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  goals: [],
  selectedGoal: null,
  totalGoals: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    status: '',
    category: '',
    priority: '',
    search: ''
  },
  stats: null
};

export const GoalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  // Fetch goals with filters and pagination
  const fetchGoals = useCallback(async (page = 1, limit = 10) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = {
        page,
        limit,
        ...Object.fromEntries(
          Object.entries(state.filters).filter(([_, value]) => value !== '')
        )
      };
      
      const response = await goalsAPI.getGoals(params);
      dispatch({ type: 'SET_GOALS', payload: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch goals';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  }, [state.filters]);

  // Fetch single goal
  const fetchGoal = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await goalsAPI.getGoal(id);
      dispatch({ type: 'SET_SELECTED_GOAL', payload: response.data.goal });
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.data.goal;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch goal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Create new goal
  const createGoal = useCallback(async (goalData) => {
    try {
      const response = await goalsAPI.createGoal(goalData);
      dispatch({ type: 'ADD_GOAL', payload: response.data.goal });
      toast.success('Goal created successfully!');
      return { success: true, goal: response.data.goal };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create goal';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update goal
  const updateGoal = useCallback(async (id, goalData) => {
    try {
      const response = await goalsAPI.updateGoal(id, goalData);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data.goal });
      toast.success('Goal updated successfully!');
      return { success: true, goal: response.data.goal };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update goal';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete goal
  const deleteGoal = useCallback(async (id) => {
    try {
      await goalsAPI.deleteGoal(id);
      dispatch({ type: 'DELETE_GOAL', payload: id });
      toast.success('Goal deleted successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete goal';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Add milestone
  const addMilestone = useCallback(async (goalId, milestoneData) => {
    try {
      const response = await goalsAPI.addMilestone(goalId, milestoneData);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data.goal });
      toast.success('Milestone added successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add milestone';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update milestone
  const updateMilestone = useCallback(async (goalId, milestoneId, milestoneData) => {
    try {
      const response = await goalsAPI.updateMilestone(goalId, milestoneId, milestoneData);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data.goal });
      toast.success('Milestone updated successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update milestone';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete milestone
  const deleteMilestone = useCallback(async (goalId, milestoneId) => {
    try {
      const response = await goalsAPI.deleteMilestone(goalId, milestoneId);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data.goal });
      toast.success('Milestone deleted successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete milestone';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Add note
  const addNote = useCallback(async (goalId, noteData) => {
    try {
      const response = await goalsAPI.addNote(goalId, noteData);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data.goal });
      toast.success('Note added successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add note';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await goalsAPI.getStats();
      dispatch({ type: 'SET_STATS', payload: response.data.stats });
      return response.data.stats;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch statistics';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    fetchGoals,
    fetchGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addNote,
    fetchStats,
    setFilters,
    clearError
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

export default GoalContext;
