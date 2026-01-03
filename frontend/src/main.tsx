import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionList } from './components/SessionList';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <SessionList />
    </StrictMode>
);
