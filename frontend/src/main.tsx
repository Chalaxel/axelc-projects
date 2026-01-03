import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionList } from './components/SessionList';
import { AuthPage } from './components/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element #root not found');
}

const App = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Chargement...</p>
            </div>
        );
    }

    return isAuthenticated ? <SessionList /> : <AuthPage />;
};

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);
