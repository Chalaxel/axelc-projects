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
import { Plus, Check, X, Info } from 'lucide-react';

interface SessionFormProps {
    onSubmit: (data: SessionCreationAttributes) => void;
    onCancel?: () => void;
    initialData?: SessionCreationAttributes;
}

export const SessionForm = ({ onSubmit, onCancel, initialData }: SessionFormProps) => {
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
        getFormData,
    } = useSessionForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(getFormData());
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-10'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                <div className='space-y-3'>
                    <Label
                        htmlFor='sport'
                        className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'
                    >
                        Discipline d'entraînement *
                    </Label>
                    <Select value={sport} onValueChange={val => setSport(val as SportEnum)}>
                        <SelectTrigger className='h-12 border-white/10 bg-white/5 font-bold text-blue-400'>
                            <SelectValue placeholder='Choisir un sport' />
                        </SelectTrigger>
                        <SelectContent className='border-white/10 bg-slate-900'>
                            <SelectItem value={SportEnum.RUN}>Course à pied</SelectItem>
                            <SelectItem value={SportEnum.SWIM}>Natation</SelectItem>
                            <SelectItem value={SportEnum.CYCLING}>Cyclisme</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <SessionDetails notes={notes} onNotesChange={setNotes} />
            </div>

            <div className='space-y-8'>
                <div className='flex items-center justify-between border-b border-white/5 pb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='h-6 w-1 rounded-full bg-blue-500'></div>
                        <Label className='text-lg font-black tracking-tight text-white uppercase'>
                            Structure de la séance
                        </Label>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SIMPLE)}
                            className='border-blue-500/30 text-[10px] font-bold tracking-widest text-blue-400 uppercase transition-all hover:bg-blue-500 hover:text-white'
                        >
                            <Plus className='mr-2 h-4 w-4' />
                            Bloc simple
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SERIES)}
                            className='border-emerald-500/30 text-[10px] font-bold tracking-widest text-emerald-400 uppercase transition-all hover:bg-emerald-500 hover:text-white'
                        >
                            <Plus className='mr-2 h-4 w-4' />
                            Série répétée
                        </Button>
                    </div>
                </div>

                {blocks.length === 0 && (
                    <div className='flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/5 bg-white/2 py-20 text-slate-500'>
                        <Info className='mb-4 h-10 w-10 text-blue-400 opacity-20' />
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

            <div className='flex justify-end gap-4 border-t border-white/5 pt-8'>
                {onCancel && (
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={onCancel}
                        className='text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase hover:text-white'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Annuler
                    </Button>
                )}
                <Button
                    type='submit'
                    className='h-12 bg-gradient-to-r from-blue-600 to-blue-700 px-10 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-blue-600 active:scale-95'
                >
                    <Check className='mr-2 h-4 w-4' />
                    {initialData ? 'Enregistrer les modifications' : 'Confirmer la séance'}
                </Button>
            </div>
        </form>
    );
};
