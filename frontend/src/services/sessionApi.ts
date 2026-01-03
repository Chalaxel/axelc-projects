import axios, { AxiosInstance } from 'axios';
import { Session, SessionCreationAttributes } from '@shared/types';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const api: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sessionApi = {
    async getSessions(): Promise<Session[]> {
        const response = await api.get<ApiResponse<Session[]>>('/sessions');
        return response.data.data || [];
    },

    async getSession(id: string): Promise<Session | null> {
        try {
            const response = await api.get<ApiResponse<Session>>(`/sessions/${id}`);
            return response.data.data || null;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async createSession(data: SessionCreationAttributes): Promise<Session> {
        const response = await api.post<ApiResponse<Session>>('/sessions', data);
        if (!response.data.data) {
            throw new Error('Failed to create session');
        }
        return response.data.data;
    },

    async updateSession(id: string, data: Partial<SessionCreationAttributes>): Promise<Session> {
        const response = await api.put<ApiResponse<Session>>(`/sessions/${id}`, data);
        if (!response.data.data) {
            throw new Error('Failed to update session');
        }
        return response.data.data;
    },

    async deleteSession(id: string): Promise<void> {
        await api.delete(`/sessions/${id}`);
    },
};
