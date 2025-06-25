import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useGoals } from '../../contexts/GoalContext';
import { X, Plus, Trash2 } from 'lucide-react';

const EditGoalModal = ({ isOpen, onClose, goal, onGoalUpdated }) => {
    const { updateGoal, loading } = useGoals();
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm({
        defaultValues: {
            title: '',
            description: '',
            category: 'personal',
            priority: 'medium',
            status: 'not-started',
            targetDate: '',
            progress: 0,
            milestones: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'milestones'
    });

    // Populate form when goal changes
    useEffect(() => {
        if (goal) {
            setValue('title', goal.title || '');
            setValue('description', goal.description || '');
            setValue('category', goal.category || 'personal');
            setValue('priority', goal.priority || 'medium');
            setValue('status', goal.status || 'not-started');
            setValue('progress', goal.progress || 0);
            setValue('targetDate', goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '');
            setValue('milestones', goal.milestones || []);
            setTags(goal.tags || []);
        }
    }, [goal, setValue]);
    const onSubmit = async (data) => {
        // Exclude disabled fields (title, category, priority) from the update
        const { title, category, priority, ...editableData } = data;

        const goalData = {
            ...editableData,
            tags,
            targetDate: new Date(editableData.targetDate).toISOString()
        };

        const result = await updateGoal(goal._id, goalData);
        if (result.success) {
            onGoalUpdated();
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
        append({ title: '', description: '', targetDate: '', completed: false });
    };

    if (!isOpen || !goal) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white dark:bg-gray-800 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
                                Edit Goal
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">                {/* Title - Read Only */}
                                <div>
                                    <label htmlFor="title" className="label">
                                        Goal Title (Cannot be changed)
                                    </label>                                    <input
                                        type="text"
                                        id="title"
                                        className="input bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                                        {...register('title')}
                                        readOnly
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Goal title cannot be modified after creation</p>
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
                                </div>                {/* Category, Priority, Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="category" className="label">
                                            Category (Cannot be changed)
                                        </label>                                        <select
                                            id="category"
                                            className="input bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                                            {...register('category')}
                                            disabled
                                            readOnly
                                        >
                                            <option value="health">Health</option>
                                            <option value="career">Career</option>
                                            <option value="education">Education</option>
                                            <option value="finance">Finance</option>
                                            <option value="personal">Personal</option>
                                            <option value="relationships">Relationships</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Category cannot be modified</p>
                                    </div>

                                    <div>
                                        <label htmlFor="priority" className="label">
                                            Priority (Cannot be changed)
                                        </label>                                        <select
                                            id="priority"
                                            className="input bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                                            {...register('priority')}
                                            disabled
                                            readOnly
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Priority cannot be modified</p>
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="label">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            className="input"
                                            {...register('status')}
                                        >
                                            <option value="not-started">Not Started</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="paused">Paused</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Target Date and Progress */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="targetDate" className="label">
                                            Target Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="targetDate"
                                            className="input"
                                            {...register('targetDate', { required: 'Target date is required' })}
                                        />
                                        {errors.targetDate && (
                                            <p className="mt-1 text-sm text-danger-600">{errors.targetDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="progress" className="label">
                                            Progress (%)
                                        </label>
                                        <input
                                            type="number"
                                            id="progress"
                                            min="0"
                                            max="100"
                                            className="input"
                                            {...register('progress', {
                                                min: { value: 0, message: 'Progress must be at least 0' },
                                                max: { value: 100, message: 'Progress cannot exceed 100' }
                                            })}
                                        />
                                        {errors.progress && (
                                            <p className="mt-1 text-sm text-danger-600">{errors.progress.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="label">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((tag, index) => (                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="Add a tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            className="input mr-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="btn-secondary"
                                        >
                                            Add
                                        </button>
                                    </div>
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
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Milestone
                                        </button>
                                    </div>

                                    {fields.map((milestone, index) => (                                        <div key={milestone.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3 bg-gray-50 dark:bg-gray-700">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Milestone {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-danger-600 hover:text-danger-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="label">Title *</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        {...register(`milestones.${index}.title`, { required: 'Milestone title is required' })}
                                                    />
                                                    {errors.milestones?.[index]?.title && (
                                                        <p className="mt-1 text-sm text-danger-600">{errors.milestones[index].title.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="label">Target Date</label>
                                                    <input
                                                        type="date"
                                                        className="input"
                                                        {...register(`milestones.${index}.targetDate`)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <label className="label">Description</label>
                                                <textarea
                                                    rows={2}
                                                    className="input"
                                                    {...register(`milestones.${index}.description`)}
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-primary-600 rounded"
                                                        {...register(`milestones.${index}.completed`)}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Completed</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-secondary"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Goal'}
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

export default EditGoalModal;
