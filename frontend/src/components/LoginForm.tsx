import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
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

            <div style={{ marginBottom: '1rem' }}>
                <label
                    htmlFor='email'
                    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                    Email
                </label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label
                    htmlFor='password'
                    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                    Mot de passe
                </label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                    }}
                />
            </div>

            <button
                type='submit'
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    );
};
