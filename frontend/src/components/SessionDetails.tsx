import { useState } from 'react';
import { formStyles } from '../styles/formStyles';

interface SessionDetailsProps {
    notes: string;
    onNotesChange: (value: string) => void;
}

export const SessionDetails = ({ notes, onNotesChange }: SessionDetailsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginBottom: isOpen ? '1rem' : '0',
                }}
            >
                {isOpen ? '▼' : '▶'} Détails de la session (optionnel)
            </button>
            {isOpen && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                    }}
                >
                    <div>
                        <label
                            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                        >
                            Notes générales
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => onNotesChange(e.target.value)}
                            rows={3}
                            style={formStyles.textarea}
                            placeholder='Notes sur la session...'
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
