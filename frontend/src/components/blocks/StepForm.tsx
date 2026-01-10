import { SportEnum, Step, StepGoal } from '@shared/types';
import { GoalFields } from '../goals/GoalFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface StepFormProps {
    step: Step;
    stepIndex: number;
    sport: SportEnum;
    totalSteps: number;
    onGoalChange: (field: keyof StepGoal, value: number | string | undefined) => void;
    onRecoveryChange: (value: number | string) => void;
    onNoteChange: (value: string) => void;
    onRemove: () => void;
}

export const StepForm = ({
    step,
    stepIndex,
    sport,
    totalSteps,
    onGoalChange,
    onRecoveryChange,
    onNoteChange,
    onRemove,
}: StepFormProps) => {
    return (
        <div className='group relative mb-4 rounded-xl border border-white/5 bg-slate-950/30 p-6 transition-all hover:border-emerald-500/20'>
            <div className='mb-6 flex items-center justify-between'>
                <span className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                    Étape {stepIndex + 1}
                </span>
                {totalSteps > 1 && (
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={onRemove}
                        className='h-8 w-8 p-0 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-400/5 hover:text-red-400'
                    >
                        <Trash2 className='h-4 w-4' />
                    </Button>
                )}
            </div>

            <GoalFields goal={step.goal} sport={sport} onChange={onGoalChange} />

            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                    <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                        Récup après étape (sec)
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        value={step.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        className='border-white/5 bg-white/5 text-slate-400 focus:border-emerald-500/50'
                        placeholder='Secondes'
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                        Note d'étape
                    </Label>
                    <Textarea
                        value={step.note || ''}
                        onChange={e => onNoteChange(e.target.value)}
                        rows={1}
                        className='resize-none border-white/5 bg-white/5 py-2 text-xs text-slate-400 transition-all focus:border-emerald-500/50'
                        placeholder='Détails spécifiques...'
                    />
                </div>
            </div>
        </div>
    );
};
