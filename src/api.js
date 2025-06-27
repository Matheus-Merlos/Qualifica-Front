import axios from 'axios';

const baseURL = 'https://api.test.qualificamais.app.br/';

const api = axios.create({
  baseURL: 'https://api.test.qualificamais.app.br/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.debug('[API Request]', config.baseURL + config.url);

    try {
      const stored = localStorage.getItem('loginData');
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn('Erro ao ler token para interceptor:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
