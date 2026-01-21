import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, RefreshCcw } from 'lucide-react';
import { GoalAttributes } from '@shared/types';
import { PeriodDisplay } from './PeriodDisplay';

interface ActiveGoalCardProps {
    goal: GoalAttributes;
    onResetPeriods: (goalId: string) => void;
    isResetting?: boolean;
}

export const ActiveGoalCard: React.FC<ActiveGoalCardProps> = ({
    goal,
    onResetPeriods,
    isResetting,
}) => {
    return (
        <Card className='border-border bg-card group relative mb-16 overflow-hidden border shadow-xl'>
            <div className='from-primary/5 group-hover:from-primary/10 absolute -top-24 -right-24 h-64 w-64 rounded-full bg-linear-to-br to-transparent blur-3xl transition-all duration-700'></div>
            <CardHeader className='relative z-10 pb-2'>
                <div className='flex items-start justify-between'>
                    <div>
                        <Badge className='bg-primary text-primary-foreground hover:bg-primary mb-3 w-fit rounded-sm px-2 py-0.5 text-[10px] font-black tracking-tighter'>
                            ACTIVE PLAN
                        </Badge>
                        <CardTitle className='text-foreground flex items-baseline gap-2 text-4xl font-black tracking-tight'>
                            Objectif {goal.targetDistance}
                        </CardTitle>
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onResetPeriods(goal.id)}
                        disabled={isResetting}
                        className='ml-4 hidden sm:flex'
                    >
                        <RefreshCcw
                            className={`mr-2 h-4 w-4 ${isResetting ? 'animate-spin' : ''}`}
                        />
                        Réinitialiser Périodes
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='relative z-10 py-6'>
                <div className='flex flex-wrap gap-10'>
                    <div className='flex items-center gap-4'>
                        <div className='border-primary/20 bg-primary/10 rounded-xl border p-3'>
                            <Clock className='text-primary h-6 w-6' />
                        </div>
                        <div>
                            <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                                Volume hebdo
                            </p>
                            <p className='text-foreground text-xl font-bold'>
                                {goal.weeklyTrainingNumbers}
                                <span className='text-muted-foreground text-sm font-medium'>
                                    séances / semaine
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
                                {new Date(goal.raceDate || '').toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <PeriodDisplay periods={goal.periods} />
            </CardContent>
        </Card>
    );
};
