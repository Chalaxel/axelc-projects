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
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
                <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
                <p className='text-slate-400 font-medium'>Chargement...</p>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto py-12 px-6'>
            <header className='flex justify-between items-center mb-12 border-b border-white/5 pb-8'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-3xl font-black tracking-tight text-white uppercase'>
                        Mes Séances
                    </h1>
                    {user && (
                        <p className='text-xs text-slate-500 font-bold uppercase tracking-widest'>
                            Athlète: {user.email}
                        </p>
                    )}
                </div>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={logout}
                    className='text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all'
                >
                    <LogOut className='w-4 h-4 mr-2' />
                    Déconnexion
                </Button>
            </header>

            {error && (
                <div className='p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold'>
                    {error}
                </div>
            )}

            <div className='mb-12'>
                {!showForm && !editingSession && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className='bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 shadow-xl shadow-blue-500/20 rounded-xl transition-all hover:scale-105'
                    >
                        <Plus className='w-5 h-5 mr-2' />
                        Nouvelle séance
                    </Button>
                )}

                {showForm && (
                    <Card className='border-white/10 bg-slate-900/60 shadow-2xl overflow-hidden'>
                        <CardHeader className='bg-white/5 border-b border-white/5'>
                            <CardTitle className='text-xl font-bold flex items-center gap-2'>
                                <Plus className='w-5 h-5 text-blue-400' />
                                Créer une nouvelle séance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-8'>
                            <SessionForm onSubmit={handleCreate} onCancel={handleCancelCreate} />
                        </CardContent>
                    </Card>
                )}

                {editingSession && (
                    <Card className='border-white/10 bg-slate-900/60 shadow-2xl overflow-hidden'>
                        <CardHeader className='bg-white/5 border-b border-white/5'>
                            <CardTitle className='text-xl font-bold flex items-center gap-2'>
                                <Plus className='w-5 h-5 text-blue-400' />
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
                    <div className='flex flex-col items-center justify-center py-24 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/2 grayscale opacity-50 transition-opacity hover:opacity-100'>
                        <Calendar className='w-12 h-12 mb-4 opacity-20' />
                        <p className='font-bold uppercase tracking-[0.2em] text-[10px]'>
                            Aucune séance enregistrée
                        </p>
                        <p className='text-sm mt-2 font-medium opacity-60'>
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
