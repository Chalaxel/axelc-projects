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
        <div className='p-6 mb-4 border border-white/5 rounded-xl bg-slate-950/30 relative group transition-all hover:border-emerald-500/20'>
            <div className='flex justify-between items-center mb-6'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                    Étape {stepIndex + 1}
                </span>
                {totalSteps > 1 && (
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={onRemove}
                        className='text-slate-500 hover:text-red-400 hover:bg-red-400/5 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all'
                    >
                        <Trash2 className='w-4 h-4' />
                    </Button>
                )}
            </div>
            
            <GoalFields goal={step.goal} sport={sport} onChange={onGoalChange} />
            
            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                    <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                        Récup après étape (sec)
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        value={step.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        className='bg-white/5 border-white/5 focus:border-emerald-500/50 text-slate-400'
                        placeholder='Secondes'
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                        Note d'étape
                    </Label>
                    <Textarea
                        value={step.note || ''}
                        onChange={e => onNoteChange(e.target.value)}
                        rows={1}
                        className='bg-white/5 border-white/5 focus:border-emerald-500/50 transition-all resize-none text-slate-400 text-xs py-2'
                        placeholder='Détails spécifiques...'
                    />
                </div>
            </div>
        </div>
    );
};
