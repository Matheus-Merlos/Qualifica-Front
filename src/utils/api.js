import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.test.qualificamais.app.br/',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.debug('[API Request]', config.baseURL + config.url);
    let token = '';

    try {
      token = JSON.parse(localStorage.getItem('token'));
    } catch (err) {
      console.warn('Erro ao ler token para interceptor:', err);
    }

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
