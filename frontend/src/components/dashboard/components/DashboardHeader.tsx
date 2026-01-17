import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Target } from 'lucide-react';
import { Goal } from '@shared/types';

interface DashboardHeaderProps {
    goals: Goal[];
    onDeletePlan: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ goals, onDeletePlan }) => {
    return (
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
                    onClick={onDeletePlan}
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
                        {goals.map((g: Goal, index: number) => (
                            <Badge
                                key={index}
                                variant='outline'
                                className={`border-border rounded-full px-4 py-2 transition-all duration-300 ${'border-primary/20 bg-primary/10 text-primary shadow-sm'}`}
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
    );
};
