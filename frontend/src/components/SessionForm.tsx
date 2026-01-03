import { useState, useEffect } from 'react';
import { SessionCreationAttributes, SportEnum } from '@shared/types';

interface SessionBlock {
    duration: number;
    note?: string;
}

interface SessionFormProps {
    onSubmit: (data: SessionCreationAttributes) => void;
    onCancel?: () => void;
    initialData?: SessionCreationAttributes;
}

export const SessionForm = ({ onSubmit, onCancel, initialData }: SessionFormProps) => {
    const [sport, setSport] = useState<SportEnum>(initialData?.sport || SportEnum.RUN);
    const [blocks, setBlocks] = useState<SessionBlock[]>(initialData?.blocks || [{ duration: 0 }]);

    useEffect(() => {
        if (initialData) {
            setSport(initialData.sport);
            setBlocks(initialData.blocks && initialData.blocks.length > 0 ? initialData.blocks : [{ duration: 0 }]);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredBlocks = blocks.filter(block => block.duration > 0);
        onSubmit({ 
            sport, 
            blocks: filteredBlocks.length > 0 ? filteredBlocks : undefined 
        });
        if (!initialData) {
            setSport(SportEnum.RUN);
            setBlocks([{ duration: 0 }]);
        }
    };

    const addBlock = () => {
        setBlocks([...blocks, { duration: 0 }]);
    };

    const removeBlock = (index: number) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter((_, i) => i !== index));
        }
    };

    const updateBlock = (index: number, field: 'duration' | 'note', value: number | string) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
        setBlocks(updatedBlocks);
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
                    htmlFor='sport'
                    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                    Sport *
                </label>
                <select
                    id='sport'
                    value={sport}
                    onChange={e => setSport(e.target.value as SportEnum)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                    }}
                >
                    <option value={SportEnum.RUN}>Course</option>
                    <option value={SportEnum.SWIM}>Natation</option>
                    <option value={SportEnum.CYCLING}>Vélo</option>
                </select>
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Blocs d'entraînement</label>
                    <button
                        type='button'
                        onClick={addBlock}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        + Ajouter un bloc
                    </button>
                </div>
                {blocks.map((block, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                Durée (min)
                            </label>
                            <input
                                type='number'
                                min='0'
                                value={block.duration || ''}
                                onChange={e => updateBlock(index, 'duration', parseInt(e.target.value) || 0)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                Note (optionnel)
                            </label>
                            <input
                                type='text'
                                value={block.note || ''}
                                onChange={e => updateBlock(index, 'note', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                }}
                                placeholder='Ex: Échauffement, Intensité...'
                            />
                        </div>
                        {blocks.length > 1 && (
                            <button
                                type='button'
                                onClick={() => removeBlock(index)}
                                style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {onCancel && (
                    <button
                        type='button'
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
                    type='submit'
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
                    {initialData ? 'Enregistrer' : 'Créer'}
                </button>
            </div>
        </form>
    );
};
