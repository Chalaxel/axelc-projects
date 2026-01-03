import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import { UserPublic } from '@shared/types';

interface AuthContextType {
    user: UserPublic | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserPublic | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (authApi.isAuthenticated()) {
                try {
                    const currentUser = await authApi.getCurrentUser();
                    if (currentUser) {
                        setUser(currentUser);
                    } else {
                        // Token invalide ou utilisateur non trouvé
                        authApi.logout();
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    authApi.logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        if (response.success && response.user) {
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Erreur lors de la connexion');
        }
    };

    const register = async (email: string, password: string) => {
        const response = await authApi.register(email, password);
        if (response.success && response.user) {
            setUser(response.user);
        } else {
            throw new Error(response.message || "Erreur lors de l'inscription");
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
