import { SessionBlock, SportEnum, StepGoal } from '@shared/types';
import { StepForm } from './StepForm';
import { formStyles } from '../../styles/formStyles';

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
        <div style={formStyles.card}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <span style={{ ...formStyles.badge, backgroundColor: '#28a745' }}>
                    Série × {block.repetitions}
                </span>
                <button
                    type='button'
                    onClick={onRemove}
                    style={{
                        ...formStyles.button,
                        padding: '0.25rem 0.75rem',
                        ...formStyles.buttonDanger,
                        fontSize: '0.85rem',
                    }}
                >
                    Supprimer
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Nombre de répétitions *
                    </label>
                    <input
                        type='number'
                        min='1'
                        value={block.repetitions || 1}
                        onChange={e => onRepetitionsChange(Number(e.target.value) || 1)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Récupération entre séries (secondes, optionnel)
                    </label>
                    <input
                        type='number'
                        min='0'
                        value={block.recovery || ''}
                        onChange={e => onRecoveryChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                        }}
                        placeholder='Secondes'
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                    }}
                >
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Étapes</label>
                    <button
                        type='button'
                        onClick={onAddStep}
                        style={{
                            ...formStyles.button,
                            padding: '0.25rem 0.75rem',
                            ...formStyles.buttonInfo,
                            fontSize: '0.85rem',
                        }}
                    >
                        + Ajouter une étape
                    </button>
                </div>

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

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Notes de la série (optionnel)
                </label>
                <textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    style={formStyles.textarea}
                    placeholder='Notes sur cette série...'
                />
            </div>
        </div>
    );
};
