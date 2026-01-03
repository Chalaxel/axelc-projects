import { SportEnum, Step, StepGoal } from '@shared/types';
import { GoalFields } from '../goals/GoalFields';
import { formStyles } from '../../styles/formStyles';

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
        <div style={formStyles.cardNested}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                }}
            >
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>
                    Étape {stepIndex + 1}
                </span>
                {totalSteps > 1 && (
                    <button
                        type='button'
                        onClick={onRemove}
                        style={{
                            ...formStyles.button,
                            padding: '0.25rem 0.5rem',
                            ...formStyles.buttonDanger,
                            fontSize: '0.75rem',
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
            <GoalFields goal={step.goal} sport={sport} onChange={onGoalChange} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Récupération après étape (secondes, optionnel)
                    </label>
                    <input
                        type='number'
                        min='0'
                        value={step.recovery || ''}
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
            <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Notes (optionnel)
                </label>
                <textarea
                    value={step.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    style={formStyles.textarea}
                    placeholder='Notes sur cette étape...'
                />
            </div>
        </div>
    );
};
