import axios from 'axios';

const PREFIURL = import.meta.env.VITE_PREFI_API;

const api = axios.create({
    baseURL: PREFIURL || 'http://localhost:3001', // La URL de tu NestJS desde variable de entorno
});

// Esto servirá para mandar el Token automáticamente en cada pedido
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;