import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { todoApi } from '../services/todoApi';

export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoApi.getTodos();
            setTodos(data);
        } catch (err) {
            setError('Erreur lors du chargement des todos');
            console.error('Error loading todos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const handleCreate = async (data: { title: string; description?: string }) => {
        try {
            await todoApi.createTodo(data);
            await loadTodos();
        } catch (err) {
            setError('Erreur lors de la création du todo');
            console.error('Error creating todo:', err);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const todo = todos.find((t) => t.id === id);
            if (todo) {
                await todoApi.updateTodo(id, { completed: !todo.completed });
                await loadTodos();
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour du todo');
            console.error('Error updating todo:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await todoApi.deleteTodo(id);
            await loadTodos();
        } catch (err) {
            setError('Erreur lors de la suppression du todo');
            console.error('Error deleting todo:', err);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: '#333' }}>Ma Liste de Todos</h1>

            {error && (
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                    }}
                >
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <TodoForm onSubmit={handleCreate} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todos.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#666',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                        }}
                    >
                        <p>Aucun todo pour le moment. Ajoutez-en un ci-dessus !</p>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
