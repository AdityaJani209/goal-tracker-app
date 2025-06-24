import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useGoals } from '../../contexts/GoalContext';
import { X, Plus, Trash2 } from 'lucide-react';

const CreateGoalModal = ({ isOpen, onClose, onGoalCreated }) => {
  const { createGoal, loading } = useGoals();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
      milestones: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones'
  });

  const onSubmit = async (data) => {
    const goalData = {
      ...data,
      tags,
      targetDate: new Date(data.targetDate).toISOString()
    };

    const result = await createGoal(goalData);
    if (result.success) {
      reset();
      setTags([]);
      setTagInput('');
      onGoalCreated();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addMilestone = () => {
    append({ title: '', description: '', targetDate: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Create New Goal
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="label">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="input"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="input"
                    {...register('description')}
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="label">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="input"
                      {...register('category', { required: 'Category is required' })}
                    >
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="career">Career</option>
                      <option value="education">Education</option>
                      <option value="finance">Finance</option>
                      <option value="relationships">Relationships</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-danger-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="priority" className="label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="input"
                      {...register('priority')}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label htmlFor="targetDate" className="label">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    id="targetDate"
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('targetDate', { required: 'Target date is required' })}
                  />
                  {errors.targetDate && (
                    <p className="mt-1 text-sm text-danger-600">{errors.targetDate.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="label">Tags</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Milestones</label>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="btn-secondary btn-sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Milestone
                    </button>
                  </div>
                  
                  {fields.length > 0 && (
                    <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start space-x-3">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Milestone title"
                              className="input"
                              {...register(`milestones.${index}.title`)}
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              className="input"
                              {...register(`milestones.${index}.description`)}
                            />
                            <input
                              type="date"
                              className="input"
                              min={new Date().toISOString().split('T')[0]}
                              {...register(`milestones.${index}.targetDate`)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-danger-600 hover:text-danger-800 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Goal'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGoalModal;
