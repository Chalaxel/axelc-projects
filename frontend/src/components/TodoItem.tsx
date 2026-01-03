import { Todo } from '@shared/types/Todo';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: todo.completed ? '#f0f0f0' : 'white',
                opacity: todo.completed ? 0.7 : 1,
            }}
        >
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div style={{ flex: 1 }}>
                <h3
                    style={{
                        margin: 0,
                        marginBottom: '0.5rem',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#666' : '#333',
                    }}
                >
                    {todo.title}
                </h3>
                {todo.description && (
                    <p
                        style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '0.9rem',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                        }}
                    >
                        {todo.description}
                    </p>
                )}
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                }}
            >
                Supprimer
            </button>
        </div>
    );
};
