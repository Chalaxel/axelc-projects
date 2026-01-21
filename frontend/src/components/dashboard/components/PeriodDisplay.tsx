import React from 'react';
import { GoalAttributes } from '@shared/types';
import { cn } from '@/lib/utils';
import { Dumbbell, TrendingUp, Zap, Flag } from 'lucide-react';

interface PeriodDisplayProps {
    periods: GoalAttributes['periods'];
    className?: string;
}

const PERIOD_CONFIG = {
    preparation: {
        label: 'Préparation',
        description: 'Remise en forme et technique',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        borderColor: 'border-emerald-200 bg-emerald-50',
        icon: Dumbbell,
    },
    general: {
        label: 'Dvlpt. Général',
        description: 'Endurance et force',
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
        borderColor: 'border-blue-200 bg-blue-50',
        icon: TrendingUp,
    },
    specific: {
        label: 'Dvlpt. Spécifique',
        description: 'Intensité course',
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
        borderColor: 'border-orange-200 bg-orange-50',
        icon: Zap,
    },
    taper: {
        label: 'Affûtage',
        description: 'Récupération avant course',
        color: 'bg-rose-500',
        textColor: 'text-rose-500',
        borderColor: 'border-rose-200 bg-rose-50',
        icon: Flag,
    },
};

export const PeriodDisplay: React.FC<PeriodDisplayProps> = ({ periods, className }) => {
    // Define the correct order of phases
    const orderedPhases: (keyof typeof periods)[] = ['preparation', 'general', 'specific', 'taper'];

    // Calculate total duration to verify proportions if needed, though flex-grow handles visual ratio
    const totalWeeks = Object.values(periods).reduce((a, b) => a + b, 0);

    return (
        <div className={cn('mt-6 w-full', className)}>
            <div className='mb-2 flex items-center justify-between'>
                <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                    Structure de la saison ({totalWeeks} semaines)
                </p>
            </div>

            {/* Visual Bar */}
            <div className='border-border/50 mb-6 flex h-8 w-full overflow-hidden rounded-full border shadow-xs'>
                {orderedPhases.map(phase => {
                    const weeks = periods[phase];
                    if (weeks === 0) return null;

                    const config = PERIOD_CONFIG[phase as keyof typeof PERIOD_CONFIG];
                    const widthPercent = (weeks / totalWeeks) * 100;

                    return (
                        <div
                            key={phase}
                            className={cn(
                                'group relative flex h-full items-center justify-center transition-all duration-300',
                                config.color,
                            )}
                            style={{ width: `${widthPercent}%` }}
                            title={`${config.label}: ${weeks} semaines`}
                        >
                            {/* Hover Overlay */}
                            <div className='absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100' />
                        </div>
                    );
                })}
            </div>

            {/* Legend / Details Grid */}
            <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
                {orderedPhases.map(phase => {
                    const weeks = periods[phase];
                    const config = PERIOD_CONFIG[phase as keyof typeof PERIOD_CONFIG];
                    const Icon = config.icon;

                    return (
                        <div
                            key={phase}
                            className={cn(
                                'flex flex-col justify-between rounded-lg border p-3 transition-all hover:shadow-md',
                                weeks === 0 ? 'opacity-50 grayscale' : 'bg-card',
                            )}
                        >
                            <div className='mb-2 flex items-start justify-between'>
                                <div className={cn('rounded-md p-1.5', config.borderColor)}>
                                    <Icon className={cn('h-4 w-4', config.textColor)} />
                                </div>
                                <span className='text-xl font-bold tabular-nums'>{weeks}</span>
                            </div>
                            <div>
                                <p className='text-foreground/90 text-xs font-semibold tracking-tight uppercase'>
                                    {config.label}
                                </p>
                                <p className='text-muted-foreground mt-0.5 text-[10px] font-medium'>
                                    {weeks > 1 ? 'Semaines' : 'Semaine'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
