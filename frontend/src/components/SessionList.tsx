import { useState, useEffect } from 'react';
import { Session, SessionCreationAttributes } from '@shared/types';
import { SessionItem } from './SessionItem';
import { SessionForm } from './SessionForm';
import { sessionApi } from '../services/sessionApi';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, LogOut, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const SessionList = () => {
    const { user, logout } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getStartOfWeek(new Date()));

    const loadSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sessionApi.getSessions();
            const sortedData = [...data].sort((a, b) => {
                const dateA = a.date || a.createdAt;
                const dateB = b.date || b.createdAt;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
            setSessions(sortedData);
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

    const handleCancelCreate = () => {
        setShowForm(false);
    };

    const navigateWeek = (weeks: number) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + weeks * 7);
        setCurrentWeekStart(newDate);
    };

    const goToToday = () => {
        setCurrentWeekStart(getStartOfWeek(new Date()));
    };

    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const filteredSessions = sessions.filter(s => {
        if (!s.date) return false;
        const sessionDate = new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= currentWeekStart && sessionDate <= weekEnd;
    });

    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const sessionsByDay = daysOfWeek.map((dayName, index) => {
        const dayDate = new Date(currentWeekStart);
        dayDate.setDate(dayDate.getDate() + index);
        const dateStr = dayDate.toISOString().split('T')[0];

        return {
            name: dayName,
            date: dayDate,
            sessions: filteredSessions.filter(s => s.date === dateStr),
        };
    });

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
                <div className='flex items-center gap-4'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => (window.location.href = '/')}
                        className='text-slate-400 transition-all hover:bg-blue-400/5 hover:text-blue-400'
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={logout}
                        className='text-slate-400 transition-all hover:bg-red-400/5 hover:text-red-400'
                    >
                        <LogOut className='mr-2 h-4 w-4' />
                        Déconnexion
                    </Button>
                </div>
            </header>

            {error && (
                <div className='mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-400'>
                    {error}
                </div>
            )}

            <div className='mb-12'>
                <div className='mb-8 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        {!showForm && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className='h-10 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-700'
                            >
                                <Plus className='mr-2 h-4 w-4' />
                                Nouvelle séance
                            </Button>
                        )}
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={goToToday}
                            className='h-10 border-white/10 bg-white/5 font-bold text-slate-400 hover:bg-white/10 hover:text-white'
                        >
                            Aujourd&apos;hui
                        </Button>
                    </div>

                    <div className='flex items-center gap-6 rounded-2xl border border-white/5 bg-slate-900/40 p-1 px-4 backdrop-blur-sm'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => navigateWeek(-1)}
                            className='h-8 w-8 text-slate-400 hover:bg-white/10 hover:text-white'
                        >
                            <ChevronLeft className='h-5 w-5' />
                        </Button>

                        <div className='flex min-w-[200px] flex-col items-center'>
                            <span className='text-[10px] font-black tracking-widest text-blue-500 uppercase'>
                                Semaine du
                            </span>
                            <span className='text-sm font-bold text-white'>
                                {currentWeekStart.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                })}
                                {' — '}
                                {weekEnd.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                })}
                            </span>
                        </div>

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => navigateWeek(1)}
                            className='h-8 w-8 text-slate-400 hover:bg-white/10 hover:text-white'
                        >
                            <ChevronRight className='h-5 w-5' />
                        </Button>
                    </div>
                </div>

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
            </div>

            <section className='space-y-12'>
                {sessionsByDay.map(day => (
                    <div key={day.name} className='space-y-4'>
                        <div className='flex items-center justify-between border-b border-white/5 pb-2'>
                            <div className='flex items-baseline gap-3'>
                                <h3 className='text-lg font-black tracking-tight text-white uppercase'>
                                    {day.name}
                                </h3>
                                <span className='text-xs font-bold text-slate-500'>
                                    {day.date.toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </span>
                            </div>
                            {day.sessions.length > 0 && (
                                <span className='text-[10px] font-black tracking-widest text-blue-500/60 uppercase'>
                                    {day.sessions.length} séance{day.sessions.length > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        <div className='grid gap-4'>
                            {day.sessions.length > 0 ? (
                                day.sessions.map(session => (
                                    <SessionItem key={session.id} session={session} />
                                ))
                            ) : (
                                <p className='py-4 text-xs font-medium text-slate-600 italic'>
                                    Aucune séance prévue
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
