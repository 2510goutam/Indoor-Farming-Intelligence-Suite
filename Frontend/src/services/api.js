import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        if (error.response?.status === 401) {
            if (!window.location.pathname.includes('/login')) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export default api;
