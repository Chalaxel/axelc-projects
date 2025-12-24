import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const LadmApp = lazy(() => import('@apps/ladm/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));

const LoadingFallback = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
    }}>
        <p>Chargement...</p>
    </div>
);

const AppSelector = () => (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '2rem'
    }}>
        <h1>Monorepo Apps</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
            <a href="/ladm" style={{ 
                padding: '1rem 2rem', 
                background: '#333', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '8px'
            }}>
                LADM App
            </a>
        </nav>
    </div>
);

export const App = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<AppSelector />} />
                <Route path="/ladm/*" element={<LadmApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

