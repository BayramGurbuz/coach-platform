import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Coaches API
export const coachesAPI = {
  getAll: (params) => api.get('/coaches', { params }),
  getById: (id) => api.get(`/coaches/${id}`),
  register: (data) => api.post('/coaches/register', data),
  login: (data) => api.post('/coaches/login', data),
  updateProfile: (data) => api.put('/coaches/profile', data),
  getSpecialties: () => api.get('/coaches/meta/specialties'),
  changePassword: (data) => api.put('/coaches/change-password', data),
  forgotPassword: (data) => api.post('/coaches/forgot-password', data),
  updateProfileImage: (data) => api.put('/coaches/profile-image', data),
  deleteAccount: () => api.delete('/coaches/me'),
};

// Messages API
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getMyMessages: () => api.get('/messages/my-messages'),
  markAsRead: (id) => api.patch(`/messages/${id}/read`),
  markAsUnread: (id) => api.patch(`/messages/${id}/unread`),
  getUnreadCount: () => api.get('/messages/unread-count'),
  delete: (id) => api.delete(`/messages/${id}`),
  deleteAll: () => api.delete('/messages'),
};

export default api;

