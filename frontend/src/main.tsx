import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthPage } from './components/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element #root not found');
}

import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { PlanDashboard } from './components/dashboard/PlanDashboard';
import { SessionList } from './components/SessionList';

const App = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className='loading-screen'>
                <p>Initialisation de votre coach...</p>
            </div>
        );
    }

    if (!isAuthenticated) return <AuthPage />;

    // Simple routing based on URL or profile
    const path = window.location.pathname;

    if (path === '/onboarding' || !user?.profile) {
        return <OnboardingWizard />;
    }

    if (path === '/sessions') {
        return <SessionList />;
    }

    return <PlanDashboard />;
};

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);
