import { Routes, Route, Navigate } from 'react-router-dom';

export const App = () => {
    return (
        <Routes>
            <Route path="home" element={<div>Home - App2</div>} />
            <Route index element={<Navigate to="home" replace />} />
            <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
    );
};

