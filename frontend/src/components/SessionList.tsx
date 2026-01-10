import { useState, useEffect } from 'react';
import { Session } from '@shared/types';
import { SessionItem } from './SessionItem';
import { sessionApi } from '../services/sessionApi';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const SessionList = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <Loader2 className='text-primary h-8 w-8 animate-spin' />
                <p className='text-muted-foreground font-medium'>Chargement...</p>
            </div>
        );
    }

    return (
        <div className='space-y-12'>
            <section className='border-border flex items-center justify-between border-b pb-8'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-foreground text-3xl font-black tracking-tight uppercase'>
                        Mes Séances
                    </h1>
                    <p className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
                        Calendrier hebdomadaire
                    </p>
                </div>
            </section>

            {error && (
                <div className='border-destructive/20 bg-destructive/10 text-destructive mb-8 rounded-lg border p-4 text-sm font-bold'>
                    {error}
                </div>
            )}

            <div className='mb-12'>
                <div className='mb-8 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={goToToday}
                            className='border-border bg-card text-muted-foreground hover:bg-muted font-bold'
                        >
                            Aujourd&apos;hui
                        </Button>
                    </div>

                    <div className='border-border bg-card flex items-center gap-6 rounded-2xl border p-1 px-4 shadow-sm'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => navigateWeek(-1)}
                            className='text-muted-foreground hover:bg-muted h-8 w-8'
                        >
                            <ChevronLeft className='h-5 w-5' />
                        </Button>

                        <div className='flex min-w-[200px] flex-col items-center'>
                            <span className='text-primary text-[10px] font-black tracking-widest uppercase'>
                                Semaine du
                            </span>
                            <span className='text-foreground text-sm font-bold'>
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
                            className='text-muted-foreground hover:bg-muted h-8 w-8'
                        >
                            <ChevronRight className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </div>

            <section className='space-y-12'>
                {sessionsByDay.map(day => (
                    <div key={day.name} className='space-y-4'>
                        <div className='border-border flex items-center justify-between border-b pb-2'>
                            <div className='flex items-baseline gap-3'>
                                <h3 className='text-foreground text-lg font-black tracking-tight uppercase'>
                                    {day.name}
                                </h3>
                                <span className='text-muted-foreground text-xs font-bold'>
                                    {day.date.toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </span>
                            </div>
                            {day.sessions.length > 0 && (
                                <span className='text-primary/60 text-[10px] font-black tracking-widest uppercase'>
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
