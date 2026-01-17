import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
        <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
                <div className='bg-destructive/15 text-destructive border-destructive/20 rounded-md border p-3 text-sm'>
                    {error}
                </div>
            )}

            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                    type='email'
                    id='email'
                    placeholder='email@exemple.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className='space-y-2'>
                <Label htmlFor='password'>Mot de passe</Label>
                <Input
                    type='password'
                    id='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
        </form>
    );
};
