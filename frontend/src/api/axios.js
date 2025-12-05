import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/api', 
});

// --- INTERCEPTOR (NUEVO) ---
// Esto se ejecuta antes de cada petición
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Si hay token, lo añadimos al header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;