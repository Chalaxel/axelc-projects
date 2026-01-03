import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Todo, TodoCreationAttributes, TodoUpdateAttributes } from '@shared/types/Todo';

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

export const todoApi = {
    async getTodos(): Promise<Todo[]> {
        const response = await api.get<ApiResponse<Todo[]>>('/todos');
        return response.data.data || [];
    },

    async getTodo(id: string): Promise<Todo | null> {
        try {
            const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
            return response.data.data || null;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async createTodo(data: TodoCreationAttributes): Promise<Todo> {
        const response = await api.post<ApiResponse<Todo>>('/todos', data);
        if (!response.data.data) {
            throw new Error('Failed to create todo');
        }
        return response.data.data;
    },

    async updateTodo(id: string, data: TodoUpdateAttributes): Promise<Todo> {
        const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
        if (!response.data.data) {
            throw new Error('Failed to update todo');
        }
        return response.data.data;
    },

    async deleteTodo(id: string): Promise<void> {
        await api.delete(`/todos/${id}`);
    },
};
