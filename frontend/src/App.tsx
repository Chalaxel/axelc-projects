import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Template = lazy(() => import('@apps/template/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));
const App2 = lazy(() => import('@apps/app2/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));

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
            <a href="/template" style={{ 
                padding: '1rem 2rem', 
                background: '#333', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '8px'
            }}>
                Template
            </a>
            <a href="/app2" style={{ 
                padding: '1rem 2rem', 
                background: '#333', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '8px'
            }}>
                App 2
            </a>
        </nav>
    </div>
);

export const App = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<AppSelector />} />
                <Route path="/template/*" element={<Template />} />
                <Route path="/app2/*" element={<App2 />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

