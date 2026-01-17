import axios, { AxiosInstance } from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, UserWithGoals } from '@shared/types';

const api: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const TOKEN_KEY = 'auth_token';

export const authApi = {
    async register(email: string, password: string): Promise<AuthResponse> {
        const data: RegisterRequest = { email, password };
        const response = await api.post<AuthResponse>('/auth/register', data);

        if (response.data.success && response.data.token) {
            localStorage.setItem(TOKEN_KEY, response.data.token);
        }

        return response.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const data: LoginRequest = { email, password };
        const response = await api.post<AuthResponse>('/auth/login', data);

        if (response.data.success && response.data.token) {
            localStorage.setItem(TOKEN_KEY, response.data.token);
        }

        return response.data;
    },

    async getCurrentUser(): Promise<UserWithGoals | null> {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }

            const response = await api.get<{ success: boolean; user?: UserWithGoals }>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success && response.data.user) {
                return response.data.user;
            }
            return null;
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                (error.response?.status === 401 || error.response?.status === 404)
            ) {
                this.logout();
            }
            return null;
        }
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
    },
};
