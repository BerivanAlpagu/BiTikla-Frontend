import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Restoranlar
export const restaurantService = {
  getAll: () => api.get('/restaurant'),
  getById: (id) => api.get(`/restaurant/${id}`),
  getActives: () => api.get('/restaurant/actives'),
};

// Kategoriler
export const categoryService = {
  getAll: () => api.get('/category'),
  getByRestaurant: (restaurantId) => api.get(`/category/byrestaurant/${restaurantId}`),
  create: (data) => api.post('/category', data),
  update: (data) => api.put('/category', data),
};

// Menü Ürünleri
export const menuItemService = {
  getAll: () => api.get('/menuitem'),
  getById: (id) => api.get(`/menuitem/${id}`),
  getByCategory: (categoryId) => api.get(`/menuitem/bycategory/${categoryId}`),
  getByRestaurant: (restaurantId) => api.get(`/menuitem/byrestaurant/${restaurantId}`),
  create: (data) => api.post('/menuitem', data),
  update: (data) => api.put('/menuitem', data),
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

// Kullanıcılar / Auth
export const userService = {
  getAll: () => api.get('/appuser'),
  getById: (id) => api.get(`/appuser/${id}`),
  create: (data) => api.post('/appuser', data), // register için kullanılabilir
  login: (data) => api.post('/appuser/login', data), // login endpoint'i varsayıldı
};

export default api;