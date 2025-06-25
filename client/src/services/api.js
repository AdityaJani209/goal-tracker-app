import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle responses and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
    changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Goals API functions
export const goalsAPI = {
    getGoals: (params = {}) => api.get('/goals', { params }),
    getGoal: (id) => api.get(`/goals/${id}`),
    createGoal: (goalData) => api.post('/goals', goalData),
    updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
    deleteGoal: (id) => api.delete(`/goals/${id}`),
    getStats: () => api.get('/goals/stats/overview'),

    // Milestones
    addMilestone: (goalId, milestoneData) =>
        api.post(`/goals/${goalId}/milestones`, milestoneData),
    updateMilestone: (goalId, milestoneId, milestoneData) =>
        api.put(`/goals/${goalId}/milestones/${milestoneId}`, milestoneData),
    deleteMilestone: (goalId, milestoneId) =>
        api.delete(`/goals/${goalId}/milestones/${milestoneId}`),

    // Notes
    addNote: (goalId, noteData) =>
        api.post(`/goals/${goalId}/notes`, noteData),
};

export default api;
