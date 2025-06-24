import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../contexts/GoalContext';
import {
  Calendar,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Circle,
  ArrowLeft,
  Clock,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); const {
    selectedGoal,
    fetchGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    addNote,
    loading
  } = useGoals();

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', targetDate: '' });
  const [noteForm, setNoteForm] = useState({ content: '' });

  useEffect(() => {
    if (id) {
      fetchGoal(id);
    }
  }, [id, fetchGoal]);

  const handleStatusChange = async (newStatus) => {
    const result = await updateGoal(id, { status: newStatus });
    if (result.success) {
      // Goal updated successfully
    }
  };

  const handleMilestoneToggle = async (milestoneId, completed) => {
    const result = await updateMilestone(id, milestoneId, {
      completed: !completed,
      completedAt: !completed ? new Date() : null
    });
    if (result.success) {
      // Milestone updated successfully
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneForm.title.trim()) return;

    const result = await addMilestone(id, milestoneForm);
    if (result.success) {
      setMilestoneForm({ title: '', description: '', targetDate: '' });
      setShowAddMilestone(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteForm.content.trim()) return;

    const result = await addNote(id, noteForm);
    if (result.success) {
      setNoteForm({ content: '' });
      setShowAddNote(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      const result = await deleteGoal(id);
      if (result.success) {
        navigate('/goals');
      }
    }
  };

  if (loading || !selectedGoal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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

  const completedMilestones = selectedGoal.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = selectedGoal.milestones?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/goals')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedGoal.title}</h1>
            <p className="text-gray-600 capitalize">{selectedGoal.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/goals/${id}/edit`)}
            className="btn-secondary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeleteGoal}
            className="btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal Overview */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>

            {selectedGoal.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedGoal.description}</p>
              </div>
            )}

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Progress</h3>
                <span className="text-sm font-medium text-gray-900">{selectedGoal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${selectedGoal.progress === 100 ? 'bg-success-600' : 'bg-primary-600'
                    }`}
                  style={{ width: `${selectedGoal.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedGoal.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`border rounded-md px-3 py-1 text-sm font-medium ${getStatusColor(selectedGoal.status)}`}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Milestones ({completedMilestones}/{totalMilestones})
              </h2>
              <button
                onClick={() => setShowAddMilestone(true)}
                className="btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </button>
            </div>

            {/* Add Milestone Form */}
            {showAddMilestone && (
              <form onSubmit={handleAddMilestone} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    className="input"
                  />
                  <input
                    type="date"
                    value={milestoneForm.targetDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                    className="input"
                  />
                  <div className="flex items-center space-x-2">
                    <button type="submit" className="btn-primary btn-sm">
                      Add Milestone
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMilestone(false)}
                      className="btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Milestones List */}
            {selectedGoal.milestones && selectedGoal.milestones.length > 0 ? (
              <div className="space-y-3">
                {selectedGoal.milestones.map((milestone) => (
                  <div key={milestone._id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleMilestoneToggle(milestone._id, milestone.completed)}
                      className="mt-1"
                    >
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-success-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {milestone.title}
                      </h4>
                      {milestone.description && (
                        <p className={`text-sm mt-1 ${milestone.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {milestone.description}
                        </p>
                      )}
                      {milestone.targetDate && (
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {format(new Date(milestone.targetDate), 'MMM d, yyyy')}
                        </div>
                      )}
                      {milestone.completedAt && (
                        <div className="flex items-center mt-2 text-xs text-success-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed {format(new Date(milestone.completedAt), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No milestones yet. Add one to break down your goal!</p>
            )}
          </div>

          {/* Notes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Notes</h2>
              <button
                onClick={() => setShowAddNote(true)}
                className="btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>

            {/* Add Note Form */}
            {showAddNote && (
              <form onSubmit={handleAddNote} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <textarea
                  placeholder="Add a note..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ content: e.target.value })}
                  className="input"
                  rows={3}
                  required
                />
                <div className="flex items-center space-x-2 mt-3">
                  <button type="submit" className="btn-primary btn-sm">
                    Add Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Notes List */}
            {selectedGoal.notes && selectedGoal.notes.length > 0 ? (
              <div className="space-y-4">
                {selectedGoal.notes.map((note) => (
                  <div key={note._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="h-5 w-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-900">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(note.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No notes yet. Add one to track your thoughts!</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal Info */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Info</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <p className="text-gray-900 capitalize">{selectedGoal.priority}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Target Date</label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(selectedGoal.targetDate), 'MMMM d, yyyy')}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <div className="flex items-center text-gray-900">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(selectedGoal.createdAt), 'MMMM d, yyyy')}
                </div>
              </div>

              {selectedGoal.completedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Completed</label>
                  <div className="flex items-center text-success-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {format(new Date(selectedGoal.completedAt), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {selectedGoal.tags && selectedGoal.tags.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGoal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
