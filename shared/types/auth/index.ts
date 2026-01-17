import { UserWithGoals } from '../user/User';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: UserWithGoals;
    message?: string;
}

export interface AuthErrorResponse {
    success: false;
    message: string;
}
