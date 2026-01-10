import { SessionCreationAttributes, SportEnum, SessionBlockType } from '@shared/types';
import { useSessionForm } from '../hooks/useSessionForm';
import { SimpleBlock } from './blocks/SimpleBlock';
import { SeriesBlock } from './blocks/SeriesBlock';
import { SessionDetails } from './SessionDetails';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Check, X, Info } from 'lucide-react';

interface SessionFormProps {
    onSubmit: (data: SessionCreationAttributes) => void;
    onCancel?: () => void;
}

export const SessionForm = ({ onSubmit, onCancel }: SessionFormProps) => {
    const {
        sport,
        setSport,
        blocks,
        notes,
        setNotes,
        addBlock,
        removeBlock,
        updateBlockGoal,
        addStep,
        removeStep,
        updateStepGoal,
        updateStep,
        updateBlockNote,
        updateSeriesRepetitions,
        updateSeriesRecovery,
        date,
        setDate,
        weekNumber,
        setWeekNumber,
        getFormData,
    } = useSessionForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(getFormData());
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-10'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                <div className='space-y-3'>
                    <Label
                        htmlFor='sport'
                        className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'
                    >
                        Discipline *
                    </Label>
                    <Select value={sport} onValueChange={val => setSport(val as SportEnum)}>
                        <SelectTrigger className='text-primary border-border bg-muted/30 h-12 font-bold'>
                            <SelectValue placeholder='Choisir un sport' />
                        </SelectTrigger>
                        <SelectContent className='border-border bg-card'>
                            <SelectItem value={SportEnum.RUN}>Course à pied</SelectItem>
                            <SelectItem value={SportEnum.SWIM}>Natation</SelectItem>
                            <SelectItem value={SportEnum.CYCLING}>Cyclisme</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-3'>
                    <Label
                        htmlFor='date'
                        className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'
                    >
                        Date de session
                    </Label>
                    <Input
                        id='date'
                        type='date'
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className='text-primary border-border bg-muted/30 h-12 font-bold'
                    />
                </div>

                <div className='space-y-3'>
                    <Label
                        htmlFor='weekNumber'
                        className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'
                    >
                        Semaine
                    </Label>
                    <Input
                        id='weekNumber'
                        type='number'
                        placeholder='ex: 1'
                        value={weekNumber || ''}
                        onChange={e =>
                            setWeekNumber(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className='text-primary border-border bg-muted/30 h-12 font-bold'
                    />
                </div>

                <div className='flex items-end pb-1'>
                    <SessionDetails notes={notes} onNotesChange={setNotes} />
                </div>
            </div>

            <div className='space-y-8'>
                <div className='border-border flex items-center justify-between border-b pb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary h-6 w-1 rounded-full'></div>
                        <Label className='text-foreground text-lg font-black tracking-tight uppercase'>
                            Structure de la séance
                        </Label>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SIMPLE)}
                            className='border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-bold tracking-widest uppercase transition-all'
                        >
                            <Plus className='mr-2 h-4 w-4' />
                            Bloc simple
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SERIES)}
                            className='border-secondary/30 text-secondary hover:bg-secondary hover:text-secondary-foreground text-[10px] font-bold tracking-widest uppercase transition-all'
                        >
                            <Plus className='mr-2 h-4 w-4' />
                            Série répétée
                        </Button>
                    </div>
                </div>

                {blocks.length === 0 && (
                    <div className='border-border bg-muted/20 text-muted-foreground flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20'>
                        <Info className='text-primary/20 mb-4 h-10 w-10' />
                        <p className='text-[10px] font-bold tracking-[0.2em] uppercase'>
                            Aucun contenu défini
                        </p>
                        <p className='mt-2 max-w-xs text-center text-xs font-medium opacity-50'>
                            Ajoutez un bloc simple ou une série pour construire votre entraînement.
                        </p>
                    </div>
                )}

                <div className='space-y-6'>
                    {blocks.map((block, blockIndex) => {
                        if (block.type === SessionBlockType.SIMPLE) {
                            return (
                                <SimpleBlock
                                    key={blockIndex}
                                    block={block}
                                    sport={sport}
                                    onGoalChange={(field, value) =>
                                        updateBlockGoal(blockIndex, field, value)
                                    }
                                    onNoteChange={value => updateBlockNote(blockIndex, value)}
                                    onRemove={() => removeBlock(blockIndex)}
                                />
                            );
                        } else {
                            return (
                                <SeriesBlock
                                    key={blockIndex}
                                    block={block}
                                    sport={sport}
                                    onRepetitionsChange={value =>
                                        updateSeriesRepetitions(blockIndex, value)
                                    }
                                    onRecoveryChange={value =>
                                        updateSeriesRecovery(blockIndex, value)
                                    }
                                    onNoteChange={value => updateBlockNote(blockIndex, value)}
                                    onAddStep={() => addStep(blockIndex)}
                                    onRemoveStep={stepIndex => removeStep(blockIndex, stepIndex)}
                                    onStepGoalChange={(stepIndex, field, value) =>
                                        updateStepGoal(blockIndex, stepIndex, field, value)
                                    }
                                    onStepRecoveryChange={(stepIndex, value) => {
                                        updateStep(blockIndex, stepIndex, {
                                            recovery: value === '' ? undefined : Number(value),
                                        });
                                    }}
                                    onStepNoteChange={(stepIndex, value) => {
                                        updateStep(blockIndex, stepIndex, {
                                            note: value || undefined,
                                        });
                                    }}
                                    onRemove={() => removeBlock(blockIndex)}
                                />
                            );
                        }
                    })}
                </div>
            </div>

            <div className='border-border flex justify-end gap-4 border-t pt-8'>
                {onCancel && (
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={onCancel}
                        className='text-muted-foreground hover:text-foreground text-[10px] font-black tracking-[0.2em] uppercase'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Annuler
                    </Button>
                )}
                <Button
                    type='submit'
                    className='bg-primary text-primary-foreground h-12 px-10 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg transition-all hover:scale-105 active:scale-95'
                >
                    <Check className='mr-2 h-4 w-4' />
                    Confirmer la séance
                </Button>
            </div>
        </form>
    );
};
