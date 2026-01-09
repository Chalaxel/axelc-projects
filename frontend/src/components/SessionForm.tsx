import { SessionCreationAttributes, SportEnum, SessionBlockType } from '@shared/types';
import { useSessionForm } from '../hooks/useSessionForm';
import { SimpleBlock } from './blocks/SimpleBlock';
import { SeriesBlock } from './blocks/SeriesBlock';
import { SessionDetails } from './SessionDetails';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-3'>
                    <Label htmlFor='sport' className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                        Discipline d'entraînement *
                    </Label>
                    <Select
                        value={sport}
                        onValueChange={val => setSport(val as SportEnum)}
                    >
                        <SelectTrigger className='bg-white/5 border-white/10 h-12 text-blue-400 font-bold'>
                            <SelectValue placeholder='Choisir un sport' />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-900 border-white/10'>
                            <SelectItem value={SportEnum.RUN}>Course à pied</SelectItem>
                            <SelectItem value={SportEnum.SWIM}>Natation</SelectItem>
                            <SelectItem value={SportEnum.CYCLING}>Cyclisme</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <SessionDetails notes={notes} onNotesChange={setNotes} />
            </div>

            <div className='space-y-8'>
                <div className='flex justify-between items-center border-b border-white/5 pb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-1 h-6 bg-blue-500 rounded-full'></div>
                        <Label className='text-lg font-black tracking-tight text-white uppercase'>Structure de la séance</Label>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SIMPLE)}
                            className='border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest'
                        >
                            <Plus className='w-4 h-4 mr-2' />
                            Bloc simple
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => addBlock(SessionBlockType.SERIES)}
                            className='border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest'
                        >
                            <Plus className='w-4 h-4 mr-2' />
                            Série répétée
                        </Button>
                    </div>
                </div>

                {blocks.length === 0 && (
                    <div className='py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/2'>
                        <Info className='w-10 h-10 mb-4 opacity-20 text-blue-400' />
                        <p className='font-bold uppercase tracking-[0.2em] text-[10px]'>Aucun contenu défini</p>
                        <p className='text-xs mt-2 opacity-50 font-medium text-center max-w-xs'>Ajoutez un bloc simple ou une série pour construire votre entraînement.</p>
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
                                    onRecoveryChange={value => updateSeriesRecovery(blockIndex, value)}
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
                                        updateStep(blockIndex, stepIndex, { note: value || undefined });
                                    }}
                                    onRemove={() => removeBlock(blockIndex)}
                                />
                            );
                        }
                    })}
                </div>
            </div>

            <div className='flex gap-4 justify-end pt-8 border-t border-white/5'>
                {onCancel && (
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={onCancel}
                        className='text-slate-400 hover:text-white uppercase text-[10px] font-black tracking-[0.2em]'
                    >
                        <X className='w-4 h-4 mr-2' />
                        Annuler
                    </Button>
                )}
                <Button 
                    type='submit' 
                    className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-10 h-12 uppercase text-[10px] font-black tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95'
                >
                    <Check className='w-4 h-4 mr-2' />
                    {initialData ? 'Enregistrer les modifications' : 'Confirmer la séance'}
                </Button>
            </div>
        </form>
    );
};
