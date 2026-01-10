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
            <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
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
                <div className='flex items-center space-x-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 transition-all hover:border-white/10'>
                    <RadioGroupItem
                        value='distance'
                        id='mode-dist'
                        className='border-blue-500 text-blue-500'
                    />
                    <Label
                        htmlFor='mode-dist'
                        className='cursor-pointer text-xs font-bold text-slate-300'
                    >
                        Distance ({getDistanceUnit(sport)})
                    </Label>
                </div>
                <div className='flex items-center space-x-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 transition-all hover:border-white/10'>
                    <RadioGroupItem
                        value='time'
                        id='mode-time'
                        className='border-blue-500 text-blue-500'
                    />
                    <Label
                        htmlFor='mode-time'
                        className='cursor-pointer text-xs font-bold text-slate-300'
                    >
                        Temps (sec)
                    </Label>
                </div>
            </RadioGroup>

            {mode === 'distance' ? (
                <div className='space-y-2'>
                    <Label
                        htmlFor='dist-input'
                        className='text-[10px] tracking-widest text-slate-400 uppercase'
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
                        className='h-12 border-white/5 bg-white/5 font-bold text-blue-400 focus:border-blue-500/50'
                        placeholder={`Distance en ${getDistanceUnit(sport)}`}
                    />
                </div>
            ) : (
                <div className='space-y-2'>
                    <Label
                        htmlFor='time-input'
                        className='text-[10px] tracking-widest text-slate-400 uppercase'
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
                        className='h-12 border-white/5 bg-white/5 font-bold text-blue-400 focus:border-blue-500/50'
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
        <div className='space-y-4 border-t border-white/5 pt-4'>
            <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                Objectif de performance
            </Label>
            {sport === SportEnum.RUN && (
                <div className='space-y-2'>
                    <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>
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
                        className='border-white/5 bg-white/5 font-bold text-emerald-400 focus:border-blue-500/50'
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

const SwimObjectiveFields = ({ goalData, onChange }: { goalData: StepGoal; onChange: any }) => {
    const strokeOptions = getStrokeOptions();

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
                <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>
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
                    className='border-white/5 bg-white/5 font-bold text-emerald-400 focus:border-blue-500/50'
                />
            </div>
            <div className='space-y-2'>
                <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>Nage</Label>
                <Select
                    value={goalData.stroke || ''}
                    onValueChange={val => onChange('stroke', val || undefined)}
                >
                    <SelectTrigger className='border-white/5 bg-white/5 text-slate-300'>
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

const CyclingObjectiveFields = ({ goalData, onChange }: { goalData: StepGoal; onChange: any }) => {
    return (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
                <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>
                    Puissance (W)
                </Label>
                <Input
                    type='number'
                    value={goalData.power || ''}
                    onChange={e =>
                        onChange('power', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='border-white/5 bg-white/5 font-bold text-emerald-400'
                />
            </div>
            <div className='space-y-2'>
                <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>
                    Cadence (rpm)
                </Label>
                <Input
                    type='number'
                    value={goalData.cadence || ''}
                    onChange={e =>
                        onChange('cadence', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='border-white/5 bg-white/5 text-slate-300'
                />
            </div>
            <div className='col-span-2 space-y-2 md:col-span-1'>
                <Label className='text-[10px] tracking-widest text-slate-400 uppercase'>
                    Vitesse (km/h)
                </Label>
                <Input
                    type='number'
                    step='0.1'
                    value={goalData.speed || ''}
                    onChange={e =>
                        onChange('speed', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className='border-white/5 bg-white/5 text-slate-300'
                />
            </div>
        </div>
    );
};
