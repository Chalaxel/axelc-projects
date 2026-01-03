import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Template = lazy(() => import('@apps/template/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));
const TodoList = lazy(() => import('@apps/todo-list/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));

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
            <a href="/todo-list" style={{ 
                padding: '1rem 2rem', 
                background: '#333', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '8px'
            }}>
                Todo List
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
                <Route path="/todo-list/*" element={<TodoList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

