import { SportEnum, StepGoal } from '@shared/types';
import { getDistanceUnit, getStrokeOptions } from '../../utils/sessionHelpers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface GoalFieldsProps {
    goal: StepGoal | undefined;
    sport: SportEnum;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

export const GoalFields = ({ goal, sport, onChange }: GoalFieldsProps) => {
    const goalData = goal || {};

    return (
        <div className='space-y-6'>
            <LengthField goalData={goalData} sport={sport} onChange={onChange} />
            <ObjectiveField goalData={goalData} sport={sport} onChange={onChange} />
        </div>
    );
};

interface LengthFieldProps {
    goalData: StepGoal;
    sport: SportEnum;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const LengthField = ({ goalData, sport, onChange }: LengthFieldProps) => {
    const mode = goalData.time !== undefined ? 'time' : 'distance';

    return (
        <div className='space-y-4'>
            <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                Type de mesure
            </Label>
            <RadioGroup
                value={mode}
                onValueChange={val => {
                    if (val === 'time') {
                        onChange('time', goalData.time || 0);
                        onChange('distance', undefined);
                    } else {
                        onChange('distance', goalData.distance || 0);
                        onChange('time', undefined);
                    }
                }}
                className='flex gap-4'
            >
                <div className='border-border bg-card hover:border-border/50 flex items-center space-x-2 rounded-lg border px-4 py-2 transition-all'>
                    <RadioGroupItem
                        value='distance'
                        id='mode-dist'
                        className='border-primary text-primary'
                    />
                    <Label
                        htmlFor='mode-dist'
                        className='text-foreground cursor-pointer text-xs font-bold'
                    >
                        Distance ({getDistanceUnit(sport)})
                    </Label>
                </div>
                <div className='border-border bg-card hover:border-border/50 flex items-center space-x-2 rounded-lg border px-4 py-2 transition-all'>
                    <RadioGroupItem
                        value='time'
                        id='mode-time'
                        className='border-primary text-primary'
                    />
                    <Label
                        htmlFor='mode-time'
                        className='text-foreground cursor-pointer text-xs font-bold'
                    >
                        Temps (sec)
                    </Label>
                </div>
            </RadioGroup>

            {mode === 'distance' ? (
                <div className='space-y-2'>
                    <Label
                        htmlFor='dist-input'
                        className='text-muted-foreground text-[10px] tracking-widest uppercase'
                    >
                        Valeur distance
                    </Label>
                    <Input
                        id='dist-input'
                        type='number'
                        min='0'
                        step='0.01'
                        value={goalData.distance || ''}
                        onChange={e =>
                            onChange(
                                'distance',
                                e.target.value ? Number(e.target.value) : undefined,
                            )
                        }
                        className='text-primary border-border bg-muted/30 focus:border-primary/50 h-12 font-bold'
                        placeholder={`Distance en ${getDistanceUnit(sport)}`}
                    />
                </div>
            ) : (
                <div className='space-y-2'>
                    <Label
                        htmlFor='time-input'
                        className='text-muted-foreground text-[10px] tracking-widest uppercase'
                    >
                        Valeur temps
                    </Label>
                    <Input
                        id='time-input'
                        type='number'
                        min='0'
                        value={goalData.time || ''}
                        onChange={e =>
                            onChange('time', e.target.value ? Number(e.target.value) : undefined)
                        }
                        className='text-primary border-border bg-muted/30 focus:border-primary/50 h-12 font-bold'
                        placeholder='Temps en secondes'
                    />
                </div>
            )}
        </div>
    );
};

interface ObjectiveFieldProps {
    goalData: StepGoal;
    sport: SportEnum;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const ObjectiveField = ({ goalData, sport, onChange }: ObjectiveFieldProps) => {
    return (
        <div className='border-border space-y-4 border-t pt-4'>
            <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                Objectif de performance
            </Label>
            {sport === SportEnum.RUN && (
                <div className='space-y-2'>
                    <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                        Allure (min/km)
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        step='0.01'
                        value={goalData.pace || ''}
                        onChange={e =>
                            onChange('pace', e.target.value ? Number(e.target.value) : undefined)
                        }
                        className='text-primary border-border bg-muted/30 focus:border-primary/50 font-bold'
                    />
                </div>
            )}
            {sport === SportEnum.SWIM && (
                <SwimObjectiveFields goalData={goalData} onChange={onChange} />
            )}
            {sport === SportEnum.CYCLING && (
                <CyclingObjectiveFields goalData={goalData} onChange={onChange} />
            )}
        </div>
    );
};

const SwimObjectiveFields = ({
    goalData,
    onChange,
}: {
    goalData: StepGoal;
    onChange: (field: keyof StepGoal, value: any) => void;
}) => {
    const strokeOptions = getStrokeOptions();

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
                <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                    Vitesse (min/100m)
                </Label>
                <Input
                    type='number'
                    min='0'
                    step='0.01'
                    value={goalData.speed || ''}
                    onChange={e =>
                        onChange('speed', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='text-primary border-border bg-muted/30 focus:border-primary/50 font-bold'
                />
            </div>
            <div className='space-y-2'>
                <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                    Nage
                </Label>
                <Select
                    value={goalData.stroke || ''}
                    onValueChange={val => onChange('stroke', val || undefined)}
                >
                    <SelectTrigger className='text-foreground border-border bg-muted/30'>
                        <SelectValue placeholder='Style' />
                    </SelectTrigger>
                    <SelectContent>
                        {strokeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const CyclingObjectiveFields = ({
    goalData,
    onChange,
}: {
    goalData: StepGoal;
    onChange: (field: keyof StepGoal, value: any) => void;
}) => {
    return (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
                <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                    Puissance (W)
                </Label>
                <Input
                    type='number'
                    value={goalData.power || ''}
                    onChange={e =>
                        onChange('power', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='text-primary border-border bg-muted/30 font-bold'
                />
            </div>
            <div className='space-y-2'>
                <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                    Cadence (rpm)
                </Label>
                <Input
                    type='number'
                    value={goalData.cadence || ''}
                    onChange={e =>
                        onChange('cadence', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='text-foreground border-border bg-muted/30 font-bold'
                />
            </div>
            <div className='col-span-2 space-y-2 md:col-span-1'>
                <Label className='text-muted-foreground text-[10px] tracking-widest uppercase'>
                    Vitesse (km/h)
                </Label>
                <Input
                    type='number'
                    step='0.1'
                    value={goalData.speed || ''}
                    onChange={e =>
                        onChange('speed', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='text-foreground border-border bg-muted/30 font-bold'
                />
            </div>
        </div>
    );
};
