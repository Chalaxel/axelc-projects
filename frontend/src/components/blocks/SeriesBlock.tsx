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
        <div className='group relative mb-8 rounded-2xl border border-white/5 bg-slate-900/40 p-8 transition-all hover:border-emerald-500/20'>
            <div className='mb-8 flex items-center justify-between'>
                <Badge className='bg-emerald-600 font-bold tracking-tighter uppercase'>
                    Série × {block.repetitions}
                </Badge>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemove}
                    className='text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-400/5 hover:text-red-400'
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <div className='mb-10 grid grid-cols-1 gap-8 md:grid-cols-2'>
                <div className='space-y-3'>
                    <Label className='flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                        <Repeat className='h-3 w-3' /> Nombre de répétitions
                    </Label>
                    <Input
                        type='number'
                        min='1'
                        value={block.repetitions || 1}
                        onChange={e => onRepetitionsChange(Number(e.target.value) || 1)}
                        required
                        className='h-12 border-white/5 bg-white/5 text-lg font-bold text-emerald-400 focus:border-emerald-500/50'
                    />
                </div>
                <div className='space-y-3'>
                    <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                        Récup entre séries (sec)
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        value={block.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        className='h-12 border-white/5 bg-white/5 text-slate-400 focus:border-emerald-500/50'
                        placeholder='Secondes'
                    />
                </div>
            </div>

            <div className='mb-10 space-y-6'>
                <div className='flex items-center justify-between border-b border-white/5 pb-3'>
                    <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                        Séquence d'étapes
                    </Label>
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={onAddStep}
                        className='text-[10px] font-bold tracking-widest text-emerald-400 uppercase hover:bg-emerald-400/5 hover:text-emerald-300'
                    >
                        <PlusCircle className='mr-2 h-4 w-4' />
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
                            onGoalChange={(field, value) =>
                                onStepGoalChange(stepIndex, field, value)
                            }
                            onRecoveryChange={value => onStepRecoveryChange(stepIndex, value)}
                            onNoteChange={value => onStepNoteChange(stepIndex, value)}
                            onRemove={() => onRemoveStep(stepIndex)}
                        />
                    ))}
                </div>
            </div>

            <div className='space-y-3'>
                <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                    Notes de la série
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='resize-none border-white/5 bg-white/5 text-slate-300 transition-all focus:border-emerald-500/50'
                    placeholder='Précisions sur cette série répétée...'
                />
            </div>
        </div>
    );
};
