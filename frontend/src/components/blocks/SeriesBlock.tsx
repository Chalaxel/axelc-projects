import React from 'react';
import { SessionBlock, SportEnum, StepGoal } from '@shared/types';
import { GoalFields } from '../goals/GoalFields';
import { StepForm } from './StepForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Layers } from 'lucide-react';

interface SeriesBlockProps {
    block: SessionBlock;
    sport: SportEnum;
    onRepetitionsChange: (value: number) => void;
    onRecoveryChange: (value: string) => void;
    onNoteChange: (value: string) => void;
    onStepChange: (
        stepIndex: number,
        field: keyof StepGoal,
        value: number | string | undefined,
    ) => void;
    onStepNoteChange: (stepIndex: number, value: string) => void;
    onStepRecoveryChange: (stepIndex: number, value: string) => void;
    onAddStep: () => void;
    onRemoveStep: (stepIndex: number) => void;
    onRemove: () => void;
}

export const SeriesBlock = ({
    block,
    sport,
    onRepetitionsChange,
    onRecoveryChange,
    onNoteChange,
    onStepChange,
    onStepNoteChange,
    onStepRecoveryChange,
    onAddStep,
    onRemoveStep,
    onRemove,
}: SeriesBlockProps) => {
    const steps = block.steps || [];

    return (
        <div className='border-border bg-card group hover:border-secondary/20 relative mb-8 rounded-2xl border p-8 shadow-sm transition-all'>
            <div className='mb-8 flex items-center justify-between'>
                <Badge className='bg-secondary text-secondary-foreground font-bold tracking-tighter uppercase'>
                    Série × {block.repetitions}
                </Badge>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemove}
                    className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 transition-all group-hover:opacity-100'
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                    <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                        Répétitions
                    </Label>
                    <Input
                        type='number'
                        min='1'
                        value={block.repetitions || 1}
                        onChange={e => onRepetitionsChange(Number(e.target.value) || 1)}
                        required
                        className='text-secondary border-border bg-muted/30 focus:border-secondary/50 h-12 text-lg font-bold'
                    />
                </div>
                <div className='space-y-3'>
                    <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                        Récupération inter-série
                    </Label>
                    <Input
                        type='number'
                        min='0'
                        value={block.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        className='text-foreground border-border bg-muted/30 focus:border-secondary/50 h-12'
                        placeholder='Secondes'
                    />
                </div>
            </div>

            <div className='mb-10 space-y-6'>
                <div className='border-border flex items-center justify-between border-b pb-3'>
                    <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                        Séquence d&apos;étapes
                    </Label>
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={onAddStep}
                        className='border-secondary/30 text-secondary hover:bg-secondary hover:text-secondary-foreground text-[10px] font-bold uppercase transition-all'
                    >
                        <Plus className='mr-2 h-4 w-4' />
                        Ajouter une étape
                    </Button>
                </div>

                <div className='space-y-4'>
                    {steps.map((step, idx) => (
                        <StepForm
                            key={idx}
                            step={step}
                            stepIndex={idx}
                            totalSteps={steps.length}
                            sport={sport}
                            onGoalChange={(field, val) => onStepChange(idx, field, val)}
                            onNoteChange={val => onStepNoteChange(idx, val)}
                            onRecoveryChange={val => onStepRecoveryChange(idx, val)}
                            onRemove={() => onRemoveStep(idx)}
                        />
                    ))}
                </div>
            </div>

            <div className='border-border space-y-3 border-t pt-6'>
                <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                    Notes de série
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='border-border bg-muted/30 text-foreground focus:border-secondary/50 resize-none transition-all'
                    placeholder='Précisions sur cette série répétée...'
                />
            </div>
        </div>
    );
};
