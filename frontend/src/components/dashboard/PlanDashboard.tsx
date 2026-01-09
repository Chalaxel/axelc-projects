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
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
                <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
                <p className='text-slate-400 font-medium'>Chargement de votre programme...</p>
            </div>
        );
    }

    if (!plan && goals.length === 0) {
        return (
            <div className='flex items-center justify-center min-h-[80vh] px-4'>
                <Card className='w-full max-w-md border-dashed border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl'>
                    <CardHeader className='text-center'>
                        <div className='w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20'>
                            <Target className='w-8 h-8 text-blue-500' />
                        </div>
                        <CardTitle className='text-2xl font-bold'>Aucun objectif fixé</CardTitle>
                        <CardDescription>
                            Vous n&apos;avez pas encore de programme d&apos;entraînement. Commencez
                            par fixer un nouvel objectif pour générer votre coaching personnalisé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-center pb-8'>
                        <Button
                            className='bg-blue-600 hover:bg-blue-700 font-bold px-8 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95'
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
        <div className='max-w-5xl mx-auto py-12 px-6 pb-24'>
            <header className='flex flex-col gap-8 mb-12'>
                <div className='flex justify-between items-start'>
                    <div>
                        <h1 className='text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase'>
                            P3RF DASHBOARD
                        </h1>
                        <p className='text-slate-400 font-medium tracking-wide'>
                            VOTRE PROGRESSION, ANALYSÉE ET OPTIMISÉE POUR LE JOUR J.
                        </p>
                    </div>
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDeletePlan}
                        className='bg-red-500/5 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5'
                    >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Réinitialiser
                    </Button>
                </div>

                {goals.length > 0 && (
                    <div className='space-y-4'>
                        <div className='flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                            <Target className='w-3 h-3 mr-2' />
                            Objectifs prévus
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            {goals.map((g: UserGoal) => (
                                <Badge
                                    key={g.id}
                                    variant='outline'
                                    className={`px-4 py-2 border-white/5 transition-all duration-300 rounded-full ${
                                        g.status === 'active'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                    }`}
                                >
                                    <span className='font-bold mr-2'>{g.targetDistance}</span>
                                    <span className='opacity-50 text-[10px]'>
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
                <Card className='mb-16 border-none bg-slate-900/40 backdrop-blur-md shadow-2xl relative overflow-hidden group border border-white/5'>
                    <div className='absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700'></div>
                    <CardHeader className='pb-2 relative z-10'>
                        <Badge className='w-fit mb-3 bg-blue-600 hover:bg-blue-600 font-black rounded-sm px-2 py-0.5 text-[10px] tracking-tighter'>
                            ACTIVE PLAN
                        </Badge>
                        <CardTitle className='text-4xl font-black text-white tracking-tight flex items-baseline gap-2'>
                            Objectif {activeGoal.targetDistance}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-wrap gap-10 py-6 relative z-10'>
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-blue-500/10 rounded-xl border border-blue-500/20'>
                                <Clock className='w-6 h-6 text-blue-400' />
                            </div>
                            <div>
                                <p className='text-[10px] uppercase font-black tracking-widest text-slate-500'>
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
                            <div className='p-3 bg-purple-500/10 rounded-xl border border-purple-500/20'>
                                <Calendar className='w-6 h-6 text-purple-400' />
                            </div>
                            <div>
                                <p className='text-[10px] uppercase font-black tracking-widest text-slate-500'>
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
                <div className='flex justify-between items-end border-b border-white/5 pb-4'>
                    <h2 className='text-2xl font-black tracking-tight flex items-center gap-3'>
                        <div className='w-2 h-8 bg-blue-500 rounded-full'></div>
                        PROCHAINES SÉANCES
                    </h2>
                    <Button
                        variant='link'
                        className='text-blue-400 hover:text-blue-300 font-bold uppercase text-[10px] tracking-widest'
                    >
                        Voir tout le calendrier
                    </Button>
                </div>

                <div className='grid gap-6'>
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        ))
                    ) : (
                        <div className='h-48 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-500 bg-white/2 grayscale'>
                            <Calendar className='w-10 h-10 opacity-20' />
                            <p className='font-medium uppercase text-[10px] tracking-widest'>
                                Aucune séance aujourd'hui
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
