import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            await register(email, password);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
                <div className='p-3 bg-destructive/15 text-destructive rounded-md text-sm border border-destructive/20'>
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
                    minLength={6}
                />
            </div>

            <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirmer le mot de passe</Label>
                <Input
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Inscription en cours...' : "S'inscrire"}
            </Button>
        </form>
    );
};
