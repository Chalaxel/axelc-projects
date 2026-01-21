import React from 'react';
import { GoalAttributes } from '@shared/types';
import { cn } from '@/lib/utils';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { Activity, Dumbbell, Flag, Hourglass, TrendingUp, Zap } from 'lucide-react';

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
    const orderedPhases: (keyof typeof periods)[] = ['preparation', 'general', 'specific', 'taper'];

    const totalWeeks = Object.values(periods).reduce((acc, period) => acc + period.duration, 0);

    const startDate = new Date(periods.preparation.startDate);
    const today = startOfDay(new Date());
    const daysPassed = differenceInCalendarDays(today, startDate);
    const weeksPassed = Math.max(0, daysPassed / 7);
    const progressPercent = (weeksPassed / totalWeeks) * 100;
    const hasStarted = daysPassed >= 0;

    return (
        <div className={cn('mt-6 w-full', className)}>
            <div className='mb-2 flex items-center justify-between'>
                <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                    Structure de la saison ({totalWeeks} semaines)
                </p>
            </div>

            <div className='relative mx-1 mt-12 mb-8'>
                <div
                    className='absolute -top-5 z-20 flex w-[110px] -translate-x-1/2 flex-col items-center transition-all duration-500'
                    style={{ left: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                >
                    <div className={'flex flex-col items-center'}>
                        <div
                            className={cn(
                                'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold shadow-lg ring-2 ring-white transition-colors',
                                hasStarted
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-zinc-800 text-white',
                            )}
                        >
                            {hasStarted ? (
                                <>
                                    <Activity className='h-3 w-3' />
                                    <span>SEMAINE {Math.ceil(weeksPassed)}</span>
                                </>
                            ) : (
                                <>
                                    <Hourglass className='h-3 w-3' />
                                    <span>Bientôt</span>
                                </>
                            )}
                        </div>
                        <div
                            className={cn(
                                'mt-1 h-6 w-0.5 rounded-full',
                                hasStarted ? 'bg-primary' : 'bg-zinc-800',
                            )}
                        />
                    </div>
                </div>

                <div className='border-border/50 flex h-8 w-full overflow-hidden rounded-full border shadow-xs'>
                    {orderedPhases.map(phase => {
                        const weeks = periods[phase].duration;
                        if (weeks === 0) return null;

                        const config = PERIOD_CONFIG[phase as keyof typeof PERIOD_CONFIG];
                        const widthPercent = (weeks / totalWeeks) * 100;

                        return (
                            <div
                                key={phase}
                                className={cn(
                                    'group relative flex h-full items-center justify-center transition-all duration-300',
                                    config.color,
                                    !hasStarted && 'opacity-60 saturate-50',
                                )}
                                style={{ width: `${widthPercent}%` }}
                                title={`${config.label}: ${weeks} semaines`}
                            >
                                {/* Pattern overlap for not started */}
                                {!hasStarted && (
                                    <div
                                        className='absolute inset-0 opacity-10'
                                        style={{
                                            backgroundImage:
                                                'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
                                        }}
                                    />
                                )}
                                {/* Hover Overlay */}
                                <div className='absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100' />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
                {orderedPhases.map(phase => {
                    const weeks = periods[phase].duration;
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
