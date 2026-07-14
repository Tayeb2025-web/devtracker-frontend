import axios from 'axios';
import { API_BASE } from '../constants';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

export const sessionApi = {
  getAll: (params) => api.get('/sessions', { params }),
  create: (data) => api.post('/sessions', data),
  delete: (id) => api.delete(`/sessions/${id}`),
};

export const technologyApi = {
  getAll: () => api.get('/technologies'),
  create: (data) => api.post('/technologies', data),
  update: (id, data) => api.put(`/technologies/${id}`, data),
  delete: (id) => api.delete(`/technologies/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/technology-categories'),
  create: (data) => api.post('/technology-categories', data),
  update: (id, data) => api.put(`/technology-categories/${id}`, data),
  move: (id, direction) => api.post(`/technology-categories/${id}/move`, { direction }),
  delete: (id) => api.delete(`/technology-categories/${id}`),
};

export const goalApi = {
  get: () => api.get('/goals'),
  update: (target_hours) => api.put('/goals', { target_hours }),
};

export const statsApi = {
  get: () => api.get('/stats'),
  getCalendar: (year) => api.get('/calendar', { params: { year } }),
};

export const achievementApi = {
  getAll: () => api.get('/achievements'),
};

export const challengeApi = {
  getAll: () => api.get('/challenges'),
};

export const noteApi = {
  getAll: () => api.get('/notes'),
  getByDate: (date) => api.get(`/notes/${date}`),
  save: (date, data) => api.put(`/notes/${date}`, data),
};

export const userApi = {
  getProfile: () => api.get('/user'),
  updateSettings: (data) => api.put('/user/settings', data),
};

export const exportApi = {
  export: (format) => api.get('/export', { params: { format } }),
};

export default api;
