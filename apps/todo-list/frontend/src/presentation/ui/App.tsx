import { Routes, Route, Navigate } from 'react-router-dom';
import { TodoList } from '../components/TodoList';

export const App = () => {
    return (
        <Routes>
            <Route path="todos" element={<TodoList />} />
            <Route index element={<Navigate to="todos" replace />} />
            <Route path="*" element={<Navigate to="todos" replace />} />
        </Routes>
    );
};

