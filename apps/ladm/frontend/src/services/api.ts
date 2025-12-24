import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

import { API_CONFIG } from './api.config';

const api = axios.create(API_CONFIG);

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('ksaar_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Gestion des erreurs globales
        if (error.response?.status === 401) {
            // Gérer l'expiration du token
            localStorage.removeItem('ksaar_token');
            // Rediriger vers la page de connexion si nécessaire
        }
        return Promise.reject(error);
    },
);

export default api;
