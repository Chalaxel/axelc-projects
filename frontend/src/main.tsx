import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
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

const ProtectedRoute = () => {
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

    return <Outlet />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route
                        element={
                            <MainLayout>
                                <Outlet />
                            </MainLayout>
                        }
                    >
                        <Route path='/onboarding' element={<OnboardingWizard />} />
                        <Route path='/sessions' element={<SessionList />} />
                        <Route path='/' element={<PlanDashboard />} />
                        <Route path='*' element={<Navigate to='/' replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);
