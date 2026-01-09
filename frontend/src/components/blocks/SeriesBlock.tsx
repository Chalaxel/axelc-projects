import { SessionBlock, SportEnum, StepGoal } from '@shared/types';
import { StepForm } from './StepForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Repeat } from 'lucide-react';

interface SeriesBlockProps {
    block: SessionBlock;
    sport: SportEnum;
    onRepetitionsChange: (value: number) => void;
    onRecoveryChange: (value: number | string) => void;
    onNoteChange: (value: string) => void;
    onAddStep: () => void;
    onRemoveStep: (stepIndex: number) => void;
    onStepGoalChange: (
        stepIndex: number,
        field: keyof StepGoal,
        value: number | string | undefined,
    ) => void;
    onStepRecoveryChange: (stepIndex: number, value: number | string) => void;
    onStepNoteChange: (stepIndex: number, value: string) => void;
    onRemove: () => void;
}

export const SeriesBlock = ({
    block,
    sport,
    onRepetitionsChange,
    onRecoveryChange,
    onNoteChange,
    onAddStep,
    onRemoveStep,
    onStepGoalChange,
    onStepRecoveryChange,
    onStepNoteChange,
    onRemove,
}: SeriesBlockProps) => {
    const steps = block.steps || [];

    return (
        <div className='p-8 mb-8 border border-white/5 rounded-2xl bg-slate-900/40 relative group transition-all hover:border-emerald-500/20'>
            <div className='flex justify-between items-center mb-8'>
                <Badge className='bg-emerald-600 font-bold uppercase tracking-tighter'>
                    Série × {block.repetitions}
                </Badge>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemove}
                    className='text-slate-500 hover:text-red-400 hover:bg-red-400/5 opacity-0 group-hover:opacity-100 transition-all'
                >
                    <Trash2 className='w-4 h-4' />
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
                <div className='space-y-3'>
                    <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2'>
                        <Repeat className='w-3 h-3' /> Nombre de répétitions
                    </Label>
                    <Input
                        type='number'
                        min='1'
                        value={block.repetitions || 1}
                        onChange={e => onRepetitionsChange(Number(e.target.value) || 1)}
                        required
                        className='bg-white/5 border-white/5 focus:border-emerald-500/50 h-12 text-lg font-bold text-emerald-400'
                    />
                </div>
                <div className='space-y-3'>
                    <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                        Récup entre séries (sec)
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        value={block.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        className='bg-white/5 border-white/5 focus:border-emerald-500/50 h-12 text-slate-400'
                        placeholder='Secondes'
                    />
                </div>
            </div>

            <div className='space-y-6 mb-10'>
                <div className='flex justify-between items-center border-b border-white/5 pb-3'>
                    <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                        Séquence d'étapes
                    </Label>
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={onAddStep}
                        className='text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/5 font-bold text-[10px] uppercase tracking-widest'
                    >
                        <PlusCircle className='w-4 h-4 mr-2' />
                        Ajouter une étape
                    </Button>
                </div>

                <div className='space-y-4'>
                    {steps.map((step, stepIndex) => (
                        <StepForm
                            key={stepIndex}
                            step={step}
                            stepIndex={stepIndex}
                            sport={sport}
                            totalSteps={steps.length}
                            onGoalChange={(field, value) => onStepGoalChange(stepIndex, field, value)}
                            onRecoveryChange={value => onStepRecoveryChange(stepIndex, value)}
                            onNoteChange={value => onStepNoteChange(stepIndex, value)}
                            onRemove={() => onRemoveStep(stepIndex)}
                        />
                    ))}
                </div>
            </div>

            <div className='space-y-3'>
                <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                    Notes de la série
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='bg-white/5 border-white/5 focus:border-emerald-500/50 transition-all resize-none text-slate-300'
                    placeholder='Précisions sur cette série répétée...'
                />
            </div>
        </div>
    );
};
