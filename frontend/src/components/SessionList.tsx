import { useState, useEffect } from 'react';
import { Session, SessionCreationAttributes } from '@shared/types';
import { SessionItem } from './SessionItem';
import { SessionForm } from './SessionForm';
import { sessionApi } from '../services/sessionApi';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, LogOut, Loader2, Calendar } from 'lucide-react';

export const SessionList = () => {
    const { user, logout } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sessionApi.getSessions();
            setSessions(data);
        } catch (err) {
            setError('Erreur lors du chargement des sessions');
            console.error('Error loading sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleCreate = async (data: SessionCreationAttributes) => {
        try {
            await sessionApi.createSession(data);
            await loadSessions();
            setShowForm(false);
        } catch (err) {
            setError('Erreur lors de la création de la session');
            console.error('Error creating session:', err);
        }
    };

    const handleUpdate = async (data: SessionCreationAttributes) => {
        if (!editingSession) return;
        try {
            await sessionApi.updateSession(editingSession.id, data);
            await loadSessions();
            setEditingSession(null);
        } catch (err) {
            setError('Erreur lors de la mise à jour de la session');
            console.error('Error updating session:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
            return;
        }
        try {
            await sessionApi.deleteSession(id);
            await loadSessions();
            if (editingSession?.id === id) {
                setEditingSession(null);
            }
        } catch (err) {
            setError('Erreur lors de la suppression de la session');
            console.error('Error deleting session:', err);
        }
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setShowForm(false);
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
    };

    const handleCancelCreate = () => {
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
                <p className='font-medium text-slate-400'>Chargement...</p>
            </div>
        );
    }

    return (
        <div className='mx-auto max-w-4xl px-6 py-12'>
            <header className='mb-12 flex items-center justify-between border-b border-white/5 pb-8'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-3xl font-black tracking-tight text-white uppercase'>
                        Mes Séances
                    </h1>
                    {user && (
                        <p className='text-xs font-bold tracking-widest text-slate-500 uppercase'>
                            Athlète: {user.email}
                        </p>
                    )}
                </div>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={logout}
                    className='text-slate-400 transition-all hover:bg-red-400/5 hover:text-red-400'
                >
                    <LogOut className='mr-2 h-4 w-4' />
                    Déconnexion
                </Button>
            </header>

            {error && (
                <div className='mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-400'>
                    {error}
                </div>
            )}

            <div className='mb-12'>
                {!showForm && !editingSession && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className='h-12 rounded-xl bg-blue-600 px-8 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-700'
                    >
                        <Plus className='mr-2 h-5 w-5' />
                        Nouvelle séance
                    </Button>
                )}

                {showForm && (
                    <Card className='overflow-hidden border-white/10 bg-slate-900/60 shadow-2xl'>
                        <CardHeader className='border-b border-white/5 bg-white/5'>
                            <CardTitle className='flex items-center gap-2 text-xl font-bold'>
                                <Plus className='h-5 w-5 text-blue-400' />
                                Créer une nouvelle séance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-8'>
                            <SessionForm onSubmit={handleCreate} onCancel={handleCancelCreate} />
                        </CardContent>
                    </Card>
                )}

                {editingSession && (
                    <Card className='overflow-hidden border-white/10 bg-slate-900/60 shadow-2xl'>
                        <CardHeader className='border-b border-white/5 bg-white/5'>
                            <CardTitle className='flex items-center gap-2 text-xl font-bold'>
                                <Plus className='h-5 w-5 text-blue-400' />
                                Éditer la séance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-8'>
                            <SessionForm
                                onSubmit={handleUpdate}
                                onCancel={handleCancelEdit}
                                initialData={{
                                    sport: editingSession.sport,
                                    blocks: editingSession.blocks,
                                }}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            <section className='space-y-6'>
                {sessions.length === 0 ? (
                    <div className='flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/5 bg-white/2 py-24 text-slate-500 opacity-50 grayscale transition-opacity hover:opacity-100'>
                        <Calendar className='mb-4 h-12 w-12 opacity-20' />
                        <p className='text-[10px] font-bold tracking-[0.2em] uppercase'>
                            Aucune séance enregistrée
                        </p>
                        <p className='mt-2 text-sm font-medium opacity-60'>
                            Planifiez votre première sortie pour commencer.
                        </p>
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {sessions.map(session => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
