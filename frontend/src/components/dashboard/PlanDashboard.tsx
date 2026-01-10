import React, { useEffect, useState } from 'react';
import { TriathlonPlan, Session, UserGoal } from '@shared/types';
import { planApi } from '../../services/planApi';
import { sessionApi } from '../../services/sessionApi';
import { SessionItem } from '../SessionItem';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Target, Clock, Loader2 } from 'lucide-react';

export const PlanDashboard: React.FC = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState<TriathlonPlan | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const goals = user?.profile?.goals || [];
    const activeGoal = goals.find((g: UserGoal) => g.status === 'active') || goals[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPlan = await planApi.getCurrentPlan();
                setPlan(currentPlan);

                const allSessions = await sessionApi.getSessions();
                // Filter sessions for the current week or similar logic
                setSessions(allSessions.slice(0, 10));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
                <p className='font-medium text-slate-400'>Chargement de votre programme...</p>
            </div>
        );
    }

    if (!plan && goals.length === 0) {
        return (
            <div className='flex min-h-[80vh] items-center justify-center px-4'>
                <Card className='w-full max-w-md border-dashed border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm'>
                    <CardHeader className='text-center'>
                        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10'>
                            <Target className='h-8 w-8 text-blue-500' />
                        </div>
                        <CardTitle className='text-2xl font-bold'>Aucun objectif fixé</CardTitle>
                        <CardDescription>
                            Vous n&apos;avez pas encore de programme d&apos;entraînement. Commencez
                            par fixer un nouvel objectif pour générer votre coaching personnalisé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-center pb-8'>
                        <Button
                            className='bg-blue-600 px-8 font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95'
                            onClick={() => (window.location.href = '/onboarding')}
                        >
                            Démarrer mon coaching
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleDeletePlan = async () => {
        if (
            window.confirm(
                'Voulez-vous vraiment supprimer votre programme actuel ? Cette action est irréversible.',
            )
        ) {
            try {
                await planApi.deleteCurrentPlan();
                window.location.reload();
            } catch {
                alert('Erreur lors de la suppression du programme');
            }
        }
    };

    return (
        <div className='mx-auto max-w-5xl px-6 py-12 pb-24'>
            <header className='mb-12 flex flex-col gap-8'>
                <div className='flex items-start justify-between'>
                    <div>
                        <h1 className='mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent uppercase'>
                            P3RF DASHBOARD
                        </h1>
                        <p className='font-medium tracking-wide text-slate-400'>
                            VOTRE PROGRESSION, ANALYSÉE ET OPTIMISÉE POUR LE JOUR J.
                        </p>
                    </div>
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDeletePlan}
                        className='border border-red-500/20 bg-red-500/5 text-red-500 shadow-lg shadow-red-500/5 transition-all hover:bg-red-500 hover:text-white'
                    >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Réinitialiser
                    </Button>
                </div>

                {goals.length > 0 && (
                    <div className='space-y-4'>
                        <div className='flex items-center text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                            <Target className='mr-2 h-3 w-3' />
                            Objectifs prévus
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            {goals.map((g: UserGoal) => (
                                <Badge
                                    key={g.id}
                                    variant='outline'
                                    className={`rounded-full border-white/5 px-4 py-2 transition-all duration-300 ${
                                        g.status === 'active'
                                            ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                    }`}
                                >
                                    <span className='mr-2 font-bold'>{g.targetDistance}</span>
                                    <span className='text-[10px] opacity-50'>
                                        {new Date(g.raceDate || '').toLocaleDateString('fr-FR', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {activeGoal && (
                <Card className='group relative mb-16 overflow-hidden border border-none border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-md'>
                    <div className='absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 group-hover:bg-blue-500/20'></div>
                    <CardHeader className='relative z-10 pb-2'>
                        <Badge className='mb-3 w-fit rounded-sm bg-blue-600 px-2 py-0.5 text-[10px] font-black tracking-tighter hover:bg-blue-600'>
                            ACTIVE PLAN
                        </Badge>
                        <CardTitle className='flex items-baseline gap-2 text-4xl font-black tracking-tight text-white'>
                            Objectif {activeGoal.targetDistance}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='relative z-10 flex flex-wrap gap-10 py-6'>
                        <div className='flex items-center gap-4'>
                            <div className='rounded-xl border border-blue-500/20 bg-blue-500/10 p-3'>
                                <Clock className='h-6 w-6 text-blue-400' />
                            </div>
                            <div>
                                <p className='text-[10px] font-black tracking-widest text-slate-500 uppercase'>
                                    Volume hebdo
                                </p>
                                <p className='text-xl font-bold text-white'>
                                    {activeGoal.weeklyAvailability}h{' '}
                                    <span className='text-sm font-medium text-slate-500'>
                                        estimé
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='rounded-xl border border-purple-500/20 bg-purple-500/10 p-3'>
                                <Calendar className='h-6 w-6 text-purple-400' />
                            </div>
                            <div>
                                <p className='text-[10px] font-black tracking-widest text-slate-500 uppercase'>
                                    Course cible
                                </p>
                                <p className='text-xl font-bold text-white'>
                                    {new Date(activeGoal.raceDate || '').toLocaleDateString(
                                        'fr-FR',
                                        { day: 'numeric', month: 'long', year: 'numeric' },
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <section className='space-y-8'>
                <div className='flex items-end justify-between border-b border-white/5 pb-4'>
                    <h2 className='flex items-center gap-3 text-2xl font-black tracking-tight'>
                        <div className='h-8 w-2 rounded-full bg-blue-500'></div>
                        PROCHAINES SÉANCES
                    </h2>
                    <Button
                        variant='link'
                        className='text-[10px] font-bold tracking-widest text-blue-400 uppercase hover:text-blue-300'
                        onClick={() => (window.location.href = '/sessions')}
                    >
                        Voir tout le calendrier
                    </Button>
                </div>

                <div className='grid gap-6'>
                    {sessions.length > 0 ? (
                        sessions.map(session => <SessionItem key={session.id} session={session} />)
                    ) : (
                        <div className='flex h-48 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/5 bg-white/2 text-slate-500 grayscale'>
                            <Calendar className='h-10 w-10 opacity-20' />
                            <p className='text-[10px] font-medium tracking-widest uppercase'>
                                Aucune séance aujourd&apos;hui
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
