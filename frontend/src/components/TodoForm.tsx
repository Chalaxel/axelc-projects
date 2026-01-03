import { useState } from 'react';
import { TodoCreationAttributes } from '@shared/types/Todo';

interface TodoFormProps {
    onSubmit: (data: TodoCreationAttributes) => void;
    onCancel?: () => void;
    initialData?: TodoCreationAttributes;
}

export const TodoForm = ({ onSubmit, onCancel, initialData }: TodoFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit({ title: title.trim(), description: description.trim() || undefined });
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
            }}
        >
            <div>
                <label
                    htmlFor="title"
                    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                    Titre *
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                    }}
                    placeholder="Entrez un titre..."
                />
            </div>
            <div>
                <label
                    htmlFor="description"
                    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        minHeight: '100px',
                        resize: 'vertical',
                    }}
                    placeholder="Entrez une description (optionnel)..."
                />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    Ajouter
                </button>
            </div>
        </form>
    );
};
