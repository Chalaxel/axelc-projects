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
        <div className='group border-border bg-muted/20 hover:border-primary/20 relative mb-4 rounded-xl border p-6 transition-all'>
            <div className='mb-6 flex items-center justify-between'>
                <span className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
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
                        className='border-border bg-card text-foreground focus:border-primary/50'
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
                        className='border-border bg-card focus:border-primary/50 text-muted-foreground resize-none py-2 text-xs transition-all'
                        placeholder='Détails spécifiques...'
                    />
                </div>
            </div>
        </div>
    );
};
