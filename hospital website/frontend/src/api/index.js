import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
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

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Users
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getDoctors: (params) => API.get('/users/doctors', { params }),
  getById: (id) => API.get(`/users/${id}`),
  create: (data) => API.post('/users', data),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
  getAnalytics: () => API.get('/users/analytics'),
};

// Appointments
export const appointmentAPI = {
  create: (data) => API.post('/appointments', data),
  getMy: (params) => API.get('/appointments/my', { params }),
  getPrescriptions: (params) => API.get('/appointments/prescriptions', { params }),
  getAll: (params) => API.get('/appointments', { params }),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  submitPrescription: (id) => API.post(`/appointments/${id}/submit-prescription`),
  updatePrescriptionStatus: (id, prescriptionStatus) => API.put(`/appointments/${id}/prescription-status`, { prescriptionStatus }),
  delete: (id) => API.delete(`/appointments/${id}`),
};

// Reports
export const reportAPI = {
  upload: (formData) => API.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => API.get('/reports/my'),
  getAll: (params) => API.get('/reports', { params }),
  delete: (id) => API.delete(`/reports/${id}`),
};

// Medicines
export const medicineAPI = {
  getAll: (params) => API.get('/medicines', { params }),
  getById: (id) => API.get(`/medicines/${id}`),
  create: (data) => API.post('/medicines', data),
  update: (id, data) => API.put(`/medicines/${id}`, data),
  delete: (id) => API.delete(`/medicines/${id}`),
};

// Lab Tests
export const labTestAPI = {
  getAll: (params) => API.get('/labtests', { params }),
  getById: (id) => API.get(`/labtests/${id}`),
  create: (data) => API.post('/labtests', data),
  update: (id, data) => API.put(`/labtests/${id}`, data),
  delete: (id) => API.delete(`/labtests/${id}`),
};

// Orders
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMy: (params) => API.get('/orders/my', { params }),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

// Articles
export const articleAPI = {
  getAll: (params) => API.get('/articles', { params }),
  getById: (id) => API.get(`/articles/${id}`),
  create: (data) => API.post('/articles', data),
  update: (id, data) => API.put(`/articles/${id}`, data),
  delete: (id) => API.delete(`/articles/${id}`),
};

// Notifications
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markRead: () => API.put('/notifications/read-all'),
};

export default API;
