import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    tokenKey?: string;
}

export interface ApiClientOptions {
    onUnauthorized?: () => void;
    onError?: (error: AxiosError) => void;
}

export const createApiClient = (
    config: ApiClientConfig,
    options?: ApiClientOptions
): AxiosInstance => {
    const client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout || 10000,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
    });

    const tokenKey = config.tokenKey || 'auth_token';

    client.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(tokenKey);
        if (token && requestConfig.headers) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
    });

    client.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                localStorage.removeItem(tokenKey);
                options?.onUnauthorized?.();
            }
            options?.onError?.(error);
            return Promise.reject(error);
        }
    );

    return client;
};

export const createAppApiClient = (appName: string, options?: ApiClientOptions): AxiosInstance => {
    return createApiClient(
        {
            baseURL: `/api/${appName}`,
            timeout: 10000,
        },
        options
    );
};

