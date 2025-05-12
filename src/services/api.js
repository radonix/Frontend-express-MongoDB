import axios from 'axios';

const api = axios.create({
  baseURL: 'URL_DA_SUA_API_BACKEND', // Substitua pela URL da sua API
});

// Interceptor para adicionar o token JWT nas requisições protegidas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;