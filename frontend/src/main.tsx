import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthPage } from './components/AuthPage';
import { PlanDashboard } from './components/dashboard/PlanDashboard';
import { MainLayout } from './components/layout/MainLayout';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { SessionList } from './components/SessionList';
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
            <div className='bg-background flex min-h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='bg-primary h-12 w-12 animate-bounce rounded-full'></div>
                    <p className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
                        Initialisation de votre coach...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <AuthPage />;

    const path = window.location.pathname;

    if (path === '/onboarding') {
        return <OnboardingWizard />;
    }

    return <MainLayout>{path === '/sessions' ? <SessionList /> : <PlanDashboard />}</MainLayout>;
};

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);
