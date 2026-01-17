import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../../lib/utils';
import { format, nextMonday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TriathlonDistance } from '@shared/types';
import { CalendarIcon, Check } from 'lucide-react';
import { Label } from '../ui/label';
import { useEffect, useMemo } from 'react';
import { GoalForm } from '@shared/types/goal/Goal';

const TEXTS = {
    distancePrefix: 'Distance',
    programDescription: (d: string) => `Programme structuré pour ${d}`,
    raceDateLabel: 'Date de la compétition',
    raceDateHelp:
        "Cette date nous permet de structurer votre plan avec une phase d'affûtage optimale avant la course.",
    selectDate: 'Sélectionner une date',
};

const DISTANCE_LABELS = {
    [TriathlonDistance.S]: 'Sprint',
    [TriathlonDistance.M]: 'Olympic',
    [TriathlonDistance.L]: 'Half-Ironman',
    [TriathlonDistance.XL]: 'Ironman',
};

const MIN_WEEKS = {
    [TriathlonDistance.S]: 8,
    [TriathlonDistance.M]: 12,
    [TriathlonDistance.L]: 16,
    [TriathlonDistance.XL]: 24,
};

interface PlanOptionCardProps {
    distance: TriathlonDistance;
    isSelected: boolean;
    raceDate: Date | undefined;
    setRaceDistance: () => void;
    setRaceDate: (date: Date) => void;
}

const PlanOptionCard = ({
    distance,
    isSelected,
    raceDate,
    setRaceDistance: onSelect,
    setRaceDate: onDateChange,
}: PlanOptionCardProps) => {
    const date = raceDate ? new Date(raceDate) : undefined;

    const minDate = useMemo(() => {
        const date = new Date();

        const weeksRequired = MIN_WEEKS[distance];
        date.setDate(date.getDate() + weeksRequired * 7);
        return nextMonday(date);
    }, [distance]);

    useEffect(() => {
        if (!isSelected) return;

        if (raceDate && raceDate < minDate) {
            onDateChange(minDate);
        }
    }, [isSelected, raceDate, onDateChange, minDate]);

    return (
        <div
            onClick={onSelect}
            className={`relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
                isSelected
                    ? 'border-primary bg-primary/5 scale-[1.02] shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                            isSelected
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'bg-background border-border text-muted-foreground'
                        }`}
                    >
                        <span className='text-lg font-black'>{distance}</span>
                    </div>
                    <div className='flex flex-col'>
                        <h3
                            className={`text-lg font-bold transition-colors ${
                                isSelected ? 'text-primary' : 'text-foreground'
                            }`}
                        >
                            {DISTANCE_LABELS[distance]}
                        </h3>
                        <span className='text-muted-foreground text-sm'>
                            {TEXTS.programDescription(distance)}
                        </span>
                    </div>
                </div>
                <div
                    className={`transition-all duration-300 ${
                        isSelected
                            ? 'text-primary translate-x-0 opacity-100'
                            : 'translate-x-4 opacity-0'
                    }`}
                >
                    <Check className='h-6 w-6' />
                </div>
            </div>

            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isSelected ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className='border-border/50 min-h-0 overflow-hidden border-t'>
                    <div className='pt-4 pb-2' onClick={e => e.stopPropagation()}>
                        <div className='bg-background rounded-lg border p-3'>
                            <Label className='mb-2 flex items-center gap-2 font-medium'>
                                <CalendarIcon className='text-primary h-4 w-4' />
                                {TEXTS.raceDateLabel}
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !date && 'text-muted-foreground',
                                        )}
                                    >
                                        {date ? (
                                            format(date, 'PPP', { locale: fr })
                                        ) : (
                                            <span>{TEXTS.selectDate}</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <CalendarComponent
                                        mode='single'
                                        selected={date}
                                        disabled={{ before: minDate }}
                                        defaultMonth={minDate}
                                        onSelect={day => {
                                            if (day) {
                                                // Adjust for timezone offset to avoid previous day issue
                                                const adjustedDate = new Date(
                                                    day.getTime() - day.getTimezoneOffset() * 60000,
                                                );
                                                onDateChange(adjustedDate);
                                            }
                                        }}
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className='text-muted-foreground mt-2 text-xs'>
                                {TEXTS.raceDateHelp}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PlanSelectorProps {
    newGoal: Partial<GoalForm>;
    setNewGoal: (goal: Partial<GoalForm>) => void;
}

export const PlanSelector = ({ newGoal, setNewGoal }: PlanSelectorProps) => {
    return (
        <div className='bg-background/50 flex flex-col space-y-3 rounded-lg p-1'>
            {Object.values(TriathlonDistance).map(d => (
                <PlanOptionCard
                    key={d}
                    distance={d}
                    isSelected={newGoal.targetDistance === d}
                    raceDate={newGoal.raceDate}
                    setRaceDistance={() => setNewGoal({ ...newGoal, targetDistance: d })}
                    setRaceDate={date => setNewGoal({ ...newGoal, raceDate: date })}
                />
            ))}
        </div>
    );
};
