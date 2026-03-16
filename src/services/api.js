import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restoranlar
export const restaurantService = {
  getAll: () => api.get('/restaurant'),
  getById: (id) => api.get(`/restaurant/${id}`),
  getActives: () => api.get('/restaurant/actives'),
};

// Siparişler
export const orderService = {
  getAll: () => api.get('/order'),
  getById: (id) => api.get(`/order/${id}`),
  create: (data) => api.post('/order', data),
  updateStatus: (id, status) => api.put(`/order/${id}`, status),
};

// Kuryeler
export const courierService = {
  getAll: () => api.get('/courier'),
  getById: (id) => api.get(`/courier/${id}`),
  getAvailable: () => api.get('/courier/available'),
};

// Kullanıcılar
export const userService = {
  getAll: () => api.get('/appuser'),
  getById: (id) => api.get(`/appuser/${id}`),
  create: (data) => api.post('/appuser', data),
};

export default api;
