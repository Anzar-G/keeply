import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL
});

// Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 errors (auto logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Contact API
export const contactAPI = {
    getAll: async () => {
        const response = await api.get('/contacts');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/contacts/${id}`);
        return response.data;
    },

    create: async (contactData) => {
        const response = await api.post('/contacts', contactData);
        return response.data;
    },

    update: async (id, contactData) => {
        const response = await api.put(`/contacts/${id}`, contactData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    }
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    },

    register: async (username, email, password, role = 'viewer') => {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
            role
        });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Activity API
export const activityAPI = {
    getAll: async () => {
        const response = await api.get('/activities');
        return response.data;
    }
};
