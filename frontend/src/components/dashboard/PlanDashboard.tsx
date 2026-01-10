import React, { useEffect, useState } from 'react';
import { TriathlonPlan, UserGoal } from '@shared/types';
import { planApi } from '../../services/planApi';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Target, Clock, Loader2 } from 'lucide-react';

export const PlanDashboard: React.FC = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState<TriathlonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const goals = user?.profile?.goals || [];
    const activeGoal = goals.find((g: UserGoal) => g.status === 'active') || goals[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPlan = await planApi.getCurrentPlan();
                setPlan(currentPlan);
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
                <Loader2 className='text-primary h-8 w-8 animate-spin' />
                <p className='text-muted-foreground font-medium'>
                    Chargement de votre programme...
                </p>
            </div>
        );
    }

    if (!plan && goals.length === 0) {
        return (
            <div className='flex min-h-[80vh] items-center justify-center px-4'>
                <Card className='border-border bg-card w-full max-w-md border-dashed shadow-xl'>
                    <CardHeader className='text-center'>
                        <div className='border-primary/20 bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border'>
                            <Target className='text-primary h-8 w-8' />
                        </div>
                        <CardTitle className='text-foreground text-2xl font-bold'>
                            Aucun objectif fixé
                        </CardTitle>
                        <CardDescription className='text-muted-foreground'>
                            Vous n&apos;avez pas encore de programme d&apos;entraînement. Commencez
                            par fixer un nouvel objectif pour générer votre coaching personnalisé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-center pb-8'>
                        <Button
                            className='bg-primary text-primary-foreground px-8 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'
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
        <div className='space-y-12'>
            <header className='mb-12 flex flex-col gap-8'>
                <div className='flex items-start justify-between'>
                    <div>
                        <h1 className='text-foreground mb-2 text-4xl font-black tracking-tighter uppercase'>
                            Plan d&apos;Entraînement
                        </h1>
                        <p className='text-muted-foreground font-medium tracking-wide'>
                            VOTRE PROGRESSION, ANALYSÉE ET OPTIMISÉE POUR LE JOUR J.
                        </p>
                    </div>
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDeletePlan}
                        className='bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground border shadow-sm transition-all'
                    >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Réinitialiser
                    </Button>
                </div>

                {goals.length > 0 && (
                    <div className='space-y-4'>
                        <div className='text-muted-foreground flex items-center text-[10px] font-black tracking-[0.2em] uppercase'>
                            <Target className='text-primary mr-2 h-3 w-3' />
                            Objectifs prévus
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            {goals.map((g: UserGoal) => (
                                <Badge
                                    key={g.id}
                                    variant='outline'
                                    className={`border-border rounded-full px-4 py-2 transition-all duration-300 ${
                                        g.status === 'active'
                                            ? 'border-primary/20 bg-primary/10 text-primary shadow-sm'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                <Card className='border-border bg-card group relative mb-16 overflow-hidden border shadow-xl'>
                    <div className='from-primary/5 group-hover:from-primary/10 absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br to-transparent blur-3xl transition-all duration-700'></div>
                    <CardHeader className='relative z-10 pb-2'>
                        <Badge className='bg-primary text-primary-foreground hover:bg-primary mb-3 w-fit rounded-sm px-2 py-0.5 text-[10px] font-black tracking-tighter'>
                            ACTIVE PLAN
                        </Badge>
                        <CardTitle className='text-foreground flex items-baseline gap-2 text-4xl font-black tracking-tight'>
                            Objectif {activeGoal.targetDistance}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='relative z-10 flex flex-wrap gap-10 py-6'>
                        <div className='flex items-center gap-4'>
                            <div className='border-primary/20 bg-primary/10 rounded-xl border p-3'>
                                <Clock className='text-primary h-6 w-6' />
                            </div>
                            <div>
                                <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                                    Volume hebdo
                                </p>
                                <p className='text-foreground text-xl font-bold'>
                                    {activeGoal.weeklyAvailability}h{' '}
                                    <span className='text-muted-foreground text-sm font-medium'>
                                        estimé
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='border-secondary/20 bg-secondary/10 rounded-xl border p-3'>
                                <Calendar className='text-secondary h-6 w-6' />
                            </div>
                            <div>
                                <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                                    Course cible
                                </p>
                                <p className='text-foreground text-xl font-bold'>
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
        </div>
    );
};
