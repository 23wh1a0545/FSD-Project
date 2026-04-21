
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notestack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response, 

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('notestack_token');
      localStorage.removeItem('notestack_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authAPI = {
  register: (data) => API.post('/auth/register', data),

  login: (data) => API.post('/auth/login', data),

  getMe: () => API.get('/auth/me'),
};

export const notesAPI = {
  getAll: () => API.get('/notes'),

  getById: (id) => API.get(`/notes/${id}`),

  create: (data) => API.post('/notes', data),

  update: (id, data) => API.put(`/notes/${id}`, data),

  delete: (id) => API.delete(`/notes/${id}`),

  unlock: (id, password) => API.post(`/notes/${id}/unlock`, { password }),
};

export default API;
