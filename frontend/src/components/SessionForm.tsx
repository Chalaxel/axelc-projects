import { SessionCreationAttributes, SportEnum, SessionBlockType } from '@shared/types';
import { useSessionForm } from '../hooks/useSessionForm';
import { SimpleBlock } from './blocks/SimpleBlock';
import { SeriesBlock } from './blocks/SeriesBlock';
import { SessionDetails } from './SessionDetails';
import { formStyles } from '../styles/formStyles';

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
        <form onSubmit={handleSubmit} style={formStyles.container}>
            <div>
                <label htmlFor='sport' style={formStyles.label}>
                    Sport *
                </label>
                <select
                    id='sport'
                    value={sport}
                    onChange={e => setSport(e.target.value as SportEnum)}
                    required
                    style={formStyles.input}
                >
                    <option value={SportEnum.RUN}>Course</option>
                    <option value={SportEnum.SWIM}>Natation</option>
                    <option value={SportEnum.CYCLING}>Vélo</option>
                </select>
            </div>

            <SessionDetails notes={notes} onNotesChange={setNotes} />

            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <label style={{ fontWeight: 'bold' }}>{"Blocs d'entraînement"}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            type='button'
                            onClick={() => addBlock(SessionBlockType.SIMPLE)}
                            style={{
                                ...formStyles.button,
                                padding: '0.5rem 1rem',
                                ...formStyles.buttonPrimary,
                                fontSize: '0.9rem',
                            }}
                        >
                            + Bloc simple
                        </button>
                        <button
                            type='button'
                            onClick={() => addBlock(SessionBlockType.SERIES)}
                            style={{
                                ...formStyles.button,
                                padding: '0.5rem 1rem',
                                ...formStyles.buttonSuccess,
                                fontSize: '0.9rem',
                            }}
                        >
                            + Série
                        </button>
                    </div>
                </div>

                {blocks.length === 0 && (
                    <div
                        style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#666',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            border: '1px dashed #ddd',
                        }}
                    >
                        Aucun bloc. Ajoutez un bloc simple ou une série pour commencer.
                    </div>
                )}

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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {onCancel && (
                    <button
                        type='button'
                        onClick={onCancel}
                        style={{ ...formStyles.button, ...formStyles.buttonSecondary }}
                    >
                        Annuler
                    </button>
                )}
                <button type='submit' style={{ ...formStyles.button, ...formStyles.buttonPrimary }}>
                    {initialData ? 'Enregistrer' : 'Créer'}
                </button>
            </div>
        </form>
    );
};
